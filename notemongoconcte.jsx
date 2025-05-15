0) pour creer le serveur il faut installer express
npm install express  

1) Installez MongoDB : Téléchargez et installez MongoDB Community Server 

https://www.mongodb.com/try/download/community

1-2) Créez un cluster : 
- Après vous être connecté
- créez un nouveau cluster. en cliuant a gauche en ba de atlas tu vas voir 
projet0 si cest ta premiere fois toi tu vas creer un nouveau en cliquant sur new project
tu continue et tu ignore la suite apres tu cleer maintenant un cluter pour lui qui va te permettre 
(Choisissez votre fournisseur de cloud, votre région et vos spécifications)

- choisir le fournisseur de cloud (AWS, Google Cloud, Azure) et la région qui vous convient.
    -clique ceer  tu choisi cluster free
    -name : tu clange le nom en mettant ce que tu veux
    -tu peut laisser la region par default
    -it tu ignore le reste
-configuration de connexion supplementaire
    -Ajouter une adresse IP de connexion : et tu cliq aussi sur section aces reseau pour autoriser le ip 0000
    -click sur ip actuel
     -tu donne nonuser motdepass  et tu click sur utilisateur de base
     -tu choisi le moyen de connexion a nodejs et tu copie le codequ'ilva te donner
     - apres Remplacez <db_password> par le mot de passe de l' utilisateur de la base de données TIPTAMcodeback . Assurez-vous que tous les paramètres d'option son

- Ajoutez une adresse IP à la liste blanche pour autoriser l'accès à votre cluster.

- Créez un utilisateur de base de données avec un nom d'utilisateur et un mot de passe.

- Obtenez la chaîne de connexion : Une fois le cluster créé, cliquez sur "Connect" et choisissez "Connect your application". Vous obtiendrez une chaîne de connexion qui ressemble à ceci :

mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
Remplacez <username>, <password>, et <dbname> par vos informations.

2)Installer les dépendances nécessaires
Installez le package mongoose pour interagir avec MongoDB :

npm install mongoose
express : Framework pour gérer les routes et les requêtes HTTP.
mongoose : ORM pour interagir avec MongoDB.
bcrypt ou bcryptjs : Pour le hachage des mots de passe.
jsonwebtoken : Pour gérer l'authentification avec JWT.
cors : Pour autoriser les requêtes entre domaines.
dotenv (optionnel) : Pour gérer les variables d'environnement.
