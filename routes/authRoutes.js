// Création des routes d'authentification (authRoutes.js)
const express = require("express"); //express : Pour créer des applications Web.
const router = express.Router(); //Pour créer des routes dans l'application Express.

const {//importation des fonctions de contrôleur utilisateur
  register,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userControllerc");
const {
  authMiddlewarec,
  checkBlacklistedToken,
  logoutMiddleware,
} = require("../controllers/authMiddlewarec");//importation du middleware d'authentification


//Tu dois importer le middleware dans ton fichier authRoutes.js pour l'utiliser sur les routes qui nécessitent une protection (comme la récupération, la mise à jour ou la suppression d'un utilisateur).

// Routes publiques (pas besoin d'authentification)
router.post("/register", register);//route d'inscription
router.post("/login", login);//route de connexion
router.post("/logout", authMiddlewarec, logoutMiddleware);//

router.get("/users", authMiddlewarec, getUsers); // Protéger la route pour récupérer tous les utilisateurs
router.get("/users/:id", authMiddlewarec, getUserById); // Protéger la route pour récupérer un utilisateur par ID
router.put("/users/:id", authMiddlewarec, updateUser); // Protéger la route pour mettre à jour un utilisateur
router.delete("/users/:id", authMiddlewarec, deleteUser); // Protéger la route pour supprimer un utilisateur

// Exemple de route protégée
// Applique le middleware de vérification de la liste noire à toutes les routes protégées
router.use(checkBlacklistedToken);//
router.get("/protected-route", authMiddlewarec, (req, res) => {
  res.json({ message: "Vous êtes authentifié", user: req.user });
});
//router.post("/logout", authMiddlewarec, (req, res) => 
 // {//route de déconnexion 
  // Ici, tu peux invalider le token si nécessaire (voir l'étape 1.2)
 // res.status(200).json({ message: "Déconnexion réussie" });
//});

module.exports = router;//exportation du module route

{
  /**
    Explication des modifications
authMiddlewarec est utilisé comme middleware sur les routes qui nécessitent une authentification.

Les routes POST /register et POST /login restent publiques, car elles sont utilisées pour l'inscription et la connexion.

Les routes GET /users, GET /users/:id, PUT /users/:id, et DELETE /users/:id sont protégées par authMiddlewarec. Cela signifie que seuls les utilisateurs authentifiés (avec un token JWT valide) peuvent accéder à ces routes.
 

//----------------------

--------------------------


Test des routes protégées
Pour tester les routes protégées, tu dois d'abord te connecter via POST /api/auth/login pour obtenir un token.

Ensuite, utilise ce token dans l'en-tête Authorization pour accéder aux routes protégées.

Exemple de requête pour récupérer tous les utilisateurs :

http
Copy
GET /api/auth/users
Authorization: <token_jwt>
Avec ces modifications, ton middleware d'authentification sera correctement intégré et fonctionnel pour protéger les routes nécessaires.
*/
}
