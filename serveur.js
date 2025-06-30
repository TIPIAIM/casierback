 
//serveur.js

const express = require("express"); //express : Pour créer des applications Web.
const cors = require("cors"); //cors : Pour autoriser les requêtes entre domaines si tu s deja un front.
const cookieparser = require("cookie-parser"); //cookieparser : Pour les cookies dans les requêtes et les réponses.app.use(cookieparser());//pour les cookies dans les requêtes et les réponses.

require("dotenv").config(); // Charger les variables d'environnement
const path = require("path");
const app = express(); //app : Pour créer une application Express.
const port = process.env.PORT || 2025; //port : Pour définir le port du serveur.
(FRONTENDcasier = process.env.FRONTENDcasier), // Pour le développement local
  console.log("Clé secrète chargée :", process.env.JWT_SECRET); // Log pour vérifier la clé secrète noublie ps de verifier s'il est dns env
 
const allowedOrigins = [
  //Pour définir les domaines autorisés.
  // "http://example.com", // Remplacez par vos domaines autorisés
  "http://localhost:5173", // Pour le développement local
  FRONTENDcasier, // Pour le développement local
]; //allowedOrigins : Pour définir les domaines autorisés.

app.use(
  //Middleware pour autoriser les requêtes entre domaines.
  cors({
    
    origin: allowedOrigins,
    credentials: true, // Si vous utilisez des cookies ou des sessions
     //credentials : Pour autoriser les cookies ou les sessions.
    methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes HTTP acceptées
    allowedHeaders: ["Content-Type", "Authorization"], // En-têtes autorisés
  })
);
app.use(cookieparser()); //pour les cookies dans les requêtes et les réponses.
 
app.use(express.json()); //Pour analyser les objets JSON des requêtes.

//-----------------------------------------

const Basede = require("./Basededon.js"); //Basede : Pour se connecter à la base de données.
Basede(); //connexion a la base de donnée

const userRoutes = require("./routes/userRoutes"); //importation du module route utilisateur
const authRoutes = require("./routes/authRoutes"); //importation du module route identification
const demandeRoutes = require("./routes/authdemande");
const criminalRecord = require("./routes/criminalRecord");
const emailRoutes = require("./routes/emailRoutes");
const sessionRoutes = require("./routes/sessionRoutes");

// les routes
app.use("/api", userRoutes); // Routes d'enregistrement,
app.use("/api/auth", authRoutes); // Routes d'authentification
app.use("/api/demande", demandeRoutes); // Routes de demande
app.use("/traficconnexion", sessionRoutes); // Routes de gestion des sessions
//const path = require("path"); ... après app.use(express.json());
// Servir les fichiers statiques
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); //chemin pour les fichiers téléchargés

app.use("/criminal", criminalRecord);

// Ajoute cette ligne après les autres routes
app.use("/apii", emailRoutes); // Routes d'envoi d'email
// Ajoute cette ligne après les autres routes

app.get("/", (req, res) => {
  //route racine à retirer àpres
  res.send("Bienvenue, votre serveur est deja en cour");
});
app.listen(port, () => {
  console.log(` serveur demarré sur http://localhost:${port}`);
});
