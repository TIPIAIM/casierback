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
  checkBlacklistedToken,
  logoutMiddleware,
} = require("../controllers/authMiddlewarec"); //importation du middleware d'authentification
const { authMiddlewarec } = require("../controllers/authMiddlewarec");

//Tu  dois importer le middleware dans ton fichier authRoutes.js pour l'utiliser sur les routes qui nécessitent une protection (comme la récupération, la mise à jour ou la suppression d'un utilisateur).

// Routes publiques (pas besoin d'authentification)
router.post("/register", register); //route d'inscription
router.post("/verify-email", verifyEmail); // Route pour vérifier l'email
router.post("/login", login); //route de connexion
router.post("/login-after-2fa", loginAfter2FA); // Route pour se connecter après la double authentification
router.post("/logout", authMiddlewarec, logoutMiddleware);

router.get("/check-session", authMiddlewarec, (req, res) => {
  res.status(200).json({ message: "Session active", user: req.user });
});

router.get("/users", authMiddlewarec, getUsers);
router.get("/users/:id", authMiddlewarec, getUserById);
router.put("/users/:id", authMiddlewarec, updateUser);
router.delete("/users/:id", authMiddlewarec, deleteUser);

// Exemple de route protégée
// Applique le middleware de vérification de la liste noire à toutes les routes protégées
router.use(checkBlacklistedToken); //
router.get("/protected-route", authMiddlewarec, (req, res) => {
  res.json({ message: "Vous êtes authentifié", user: req.user });
});

module.exports = router; //exportation du module route
