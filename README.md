Les librairies test-helpers d’OpenZeppelin chai et mocha ont été utilisées pour effectuer les tests unitaires :

Ce code est un ensemble de tests pour le smart contract « voting »


Le test comprend quatre sections principales, chacune avec plusieurs sous tests.

La première section teste les constantes définies dans le contrat, la deuxième section teste la fonction « getVoter » qui renvoie des informations sur un votant enregistré, la troisième section teste les fonctionnalités liées aux électeurs et la quatrième vérifie les fonctionnalités liées aux propositions

1 – La première section définit les constantes RegisteringVoters, ProposalsRegistrationStarted, ProposalRegistrationEnded, VotingSessionStarted, VotingSessionEnded et VotesTallied, puis les compare aux valeurs attendues. Ces constantes représentent les différents états du système de vote.

Test de la définition des différentes étapes du workflow (workFlowStatus) :

- ce test vérifie que les différentes étapes du workflow ont été correctement définies dans le smart contrat,
- chaque test est représentée par une valeur numérique, et chaque test compare ces valeurs avec celles définies dans la smart contract,
- si une étape est mal définie, le test échouera.

2 – La deuxième section teste la fonction getVoter.

Test de récupération d’informations sur un électeur (getVoter) :

- Le premier test vérifie que la fonction getVoter renvoie les informations correctes pour un électeur enregistré en appelant addVoter au préalable. Il s’assure que l’électeur est bien enregistré, qu’il n’a pas encore voté et que l’Id de proposition pour laquelle il a voté est égal à zéro. 
Si les informations retournées ne sont pas correctes, le test échouera

Le deuxième test vérifie que la fonction getVoter renvoie une erreur si elle est appelée par un compte qui n’est pas enregistré comme votant.
Dans ce cas, une exception avec le message « you’re not a voter » doit être renvoyée, ce qui est vérifier à l’aide de la fonction « expectRevert.

3 – la troisième section teste les fonctions liées à la proposition : 

It("should allow owner to add voters during registration period ")
Le premier test vérifie que le propriétaire peut ajouter des électeurs pendant la période d’inscriptions en cours ("Registration period should be started"). Il démarre la période d’inscription, ajoute un électeur ("VoterRegistered"), vérifie que l’électeur a été ajouté avec succès ("Voter should be added succesfully") et vérifie également que l’adresse de l’électeur ajouté correspond à celle attendue ("Added voter address is incorrect").
Il teste également que si l’électeur est déjà enregistré ("Already registered"), l’ajout de cet électeur à nouveau entrainera une erreur.

Le deuxième test vérifie que le propriétaire ne peut pas ajouter d’électeurs après la fin de la période d’inscription. Il démarre la période d’inscription, met fin à la période d’inscription, puis tente d’ajouter un votant. Il vérifie que l’ajout de l’électeur a été bloqué en raison de la fin de période d’inscription ("Voters registration is not open Yet")

La quatrième section teste les fonctions liées à la proposition :

Le premier test ("should return a single proposal") vérifie que l’on peut ajouter une proposition et récupérer la description de cette proposition . Il commence par ajouter un électeur et commence la période d’enregistrement des propositions. Ensuite, il récupère la proposition avec l’index 0 et vérifie que la description de la proposition correspond bien à la description ajoutée.

Le deuxième test ("should revert if proposals registration is not started") vérifie l’ajout de propositions est bloqué si la période d’enregistrement des propositions n’a pas commencé. Il tente d’ajouter une proposition avant le début de cette période er vérifie que l’opération a échoué avec le message d’erreur ("Proposals are not allowed yet").

Le troisième test ("should revert if proposal description is empty") vérifie que l’ajout des propositions est bloqué si la description de la proposition est vide. Il commence par débuter la période d’enregistrement des propositions et ajoute un votant. Ensuite il tente d’ajouter une proposition avec une description vide et vérifie que l’opération a échoué avec le message d’erreur ("Vous ne pouvez pas ne rien proposer")


