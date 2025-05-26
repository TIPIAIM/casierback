//authRoutes.js

//  Création des routes d'authentification (authRoutes.js)
const express = require("express"); //express : Pour créer des applications Web.
const router = express.Router(); //Pour créer des routes dans l'application Express.

const {
  //importation des fonctions de contrôleur utilisateur
  register,
  login,
  verifyEmail,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginAfter2FA
} = require("../controllers/userControllerc");
const {
  authMiddlewarec,
  checkBlacklistedToken,
  logoutMiddleware,
} = require("../controllers/authMiddlewarec"); //importation du middleware d'authentification

//Tu  dois importer le middleware dans ton fichier authRoutes.js pour l'utiliser sur les routes qui nécessitent une protection (comme la récupération, la mise à jour ou la suppression d'un utilisateur).

// Routes publiques (pas besoin d'authentification)
router.post("/register", register); //route d'inscription
router.post("/verify-email", verifyEmail); // Route pour vérifier l'email
router.post("/login", login); //route de connexion
router.post("/login-after-2fa", loginAfter2FA); // Route pour se connecter après la double authentification
router.post("/logout", authMiddlewarec, logoutMiddleware); //

router.get("/users", authMiddlewarec, getUsers); // Protéger la route pour récupérer tous les utilisateurs
router.get("/users/:id", authMiddlewarec, getUserById); // Protéger la route pour récupérer un utilisateur par ID
router.put("/users/:id", authMiddlewarec, updateUser); // Protéger la route pour mettre à jour un utilisateur
router.delete("/users/:id", authMiddlewarec, deleteUser); // Protéger la route pour supprimer un utilisateur

// Exemple de route protégée
// Applique le middleware de vérification de la liste noire à toutes les routes protégées
router.use(checkBlacklistedToken); //
router.get("/protected-route", authMiddlewarec, (req, res) => {
  res.json({ message: "Vous êtes authentifié", user: req.user });
});

module.exports = router; //exportation du module route
