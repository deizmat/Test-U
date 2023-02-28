const Voting = artifacts.require("./Voting.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { WorkflowStatus } = artifacts.require("./Voting.sol"); 

contract("Voting", accounts => {

  const _owner = accounts[0];
  const _voter1 = accounts[1];
  const _voter2 = accounts[2];
  

  let votingInstance;
 
  describe ("WorkflowStatus", () => {

    beforeEach(async function() {
      votingInstance = await Voting.new({ from: _owner });
    })
          
      it('should define RegisteringVoters', () => {
        const RegisteringVoters = 0;
        expect(WorkflowStatus.RegisteringVoters).to.equal(RegisteringVoters);
      });
    
      it('should define ProposalsRegistrationStarted', () => {
        const ProposalsRegistrationStarted = 1;
        expect(WorkflowStatus.ProposalsRegistrationStarted).to.equal(ProposalsRegistrationStarted);
      });
    
      it('should define ProposalsRegistrationEnded', () => {
        const ProposalsRegistrationEnded = 2;
        expect(WorkflowStatus.ProposalsRegistrationEnded).to.equal(ProposalsRegistrationEnded);
      });
    
      it('should define VotingSessionStarted', () => {
        const VotingSessionStarted = 3;
        expect(WorkflowStatus.VotingSessionStarted).to.equal(VotingSessionStarted);
      });
    
      it('should define VotingSessionEnded', () => {
        const VotingSessionEnded = 4;
        expect(WorkflowStatus.VotingSessionEnded).to.equal(VotingSessionEnded);
      });
    
      it('should define VotesTallied', () => {
        const VotesTallied = 5;
        expect(WorkflowStatus.VotesTallied).to.equal(VotesTallied);
      });
    });

      describe("getVoter", () => {
      const addr = accounts[1];

      it("should return the correct voter information", async function() {
        
        await votingInstance.addVoter(addr, { from: _owner });
      
        const voter = await votingInstance.getVoter(addr, { from: _voter1 });
      
        expect(voter.isRegistered).to.be.true;
        expect(voter.hasVoted).to.be.false;
        expect(voter.votedProposalId).to.be.bignumber.equal(new BN(0));
      });
    
      it("should revert if called by a non-voter", async () => {
      
        await expectRevert(votingInstance.getVoter(_voter1, { from: _owner }),
        "You're not a voter");
      });
    });
  
    describe("Voter", () => {
      beforeEach(async function () {
        votingInstance = await Voting.new({ from: _owner });
        });
         
      it("should allow owner to add voters during registration period", async () => {
       
        await votingInstance.startProposalsRegistering({ from: _owner });
        const registrationStatus = await votingInstance.workflowStatus();
        assert.equal(registrationStatus, 1, "Registration period should be started");
    
        const addr = accounts[2];
        await votingInstance.addVoter(addr, { from: _owner });
        await expectEvent(votingInstance, "VoterRegistered", { _addr: addr });

        const voterAdded = await votingInstance.isRegisteredVoter(addr);
        assert.equal(voterAdded, true, "Voter should be added successfully");
      
        const addedVoter = await votingInstance.getVoter(_voter1);
        await expectRevert(addedVoter).to.equal(addr, "Added voter address is incorrect");
       
        await expectRevert(
          votingInstance.addVoter(_voter2, { from: _owner }),
          "Already registered"
        );
    });
    
      it("should not allow the owner to add voters after the registering period has ended", async () => {
        // Start and end registration period
        await votingInstance.startProposalsRegistering({ from: _owner });
        
        await votingInstance.endProposalsRegistering({ from: _owner });
      
        // Attempt to add a voter
        await expectRevert(
          votingInstance.addVoter(_voter2, { from: _owner }),
          "Voters registration is not open yet");
      });
    });

    describe("Proposal", () => {
      
      beforeEach(async () => {
        votingInstance = await Voting.new({ from: _owner });
        await votingInstance.addVoter(_voter1, { from: _owner });
        await votingInstance.addVoter(_voter2, { from: _owner });
        });

      it('should return a single proposal', async () => {
          const proposalDesc = "GENESIS";
          await votingInstance.startProposalsRegistering({ from: _owner });
          await votingInstance.addProposal(proposalDesc, { from: _voter1 });
          const proposalIndex = 0;
          const retrievedProposal = await votingInstance.getOneProposal(proposalIndex, { from: _voter2 });
          expect(retrievedProposal.description).to.equal(proposalDesc);
          });
        
      it('should revert if proposals registration is not started', async () => {
        await expectRevert(
          votingInstance.addProposal("GENESIS", { from: _voter1 }),
          "Proposals are not allowed yet" );
        });

      it('should revert if proposal description is empty', async () => {
        await votingInstance.startProposalsRegistering({ from: _owner });
        const registrationStatus = await votingInstance.workflowStatus();
        assert.equal(registrationStatus, 1, "Proposals registration should be started");
        await expectRevert(
          votingInstance.addProposal("", { from: _voter1 }),
          "Vous ne pouvez pas ne rien proposer"
          );
        });
      });
    });
    



