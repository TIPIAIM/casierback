//Définissez les routes pour gérer les requêtes HTTP.
const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// Routes pour les utilisateurs
router.post("/users", createUser); // Créer un utilisateur
router.get("/users", getUsers); // Récupérer tous les utilisateurs
router.get("/users/:id", getUserById); // Récupérer un utilisateur par ID
router.put("/users/:id", updateUser); // Mettre à jour un utilisateur
router.delete("/users/:id", deleteUser); // Supprimer un utilisateur

module.exports = router;

//Intégrez les routes et la connexion à MongoDB dans votre serveur.
