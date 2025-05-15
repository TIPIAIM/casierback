{
  /**
 un contrôleur d'authentification pour une application Node.js. Il gère l'inscription,
   la connexion, la récupération, la mise à jour et la suppression des utilisateurs. 
  Il utilise JWT (JSON Web Token) pour gérer l'authentification et bcrypt pour hacher les mots de passe
  */
}
require("dotenv").config(); // Charger les variables d'environnement
console.log("Clé secrète chargée :", process.env.JWT_SECRET); // Log pour vérifier la clé secrète
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); //jsonwebtoken : Pour gérer l'authentification avec JWT.

const Userc = require("../models/Userc"); //importation du modele utilisateur

// Inscription
const register = async (req, res) => {
  //fonction d'inscription
  try {
    //essayer
    const { name, email, password, age } = req.body; //récupération des données de l'utilisateur
    const usercExists = await Userc.findOne({ email }); //recherche de l'utilisateur par email
    if (usercExists)
      //si l'utilisateur existe déjà
      return res.status(400).json({ message: "Email déjà utilisé" }); //message d'erreur

    const userc = await Userc.create({ name, email, password, age }); //création de l'utilisateur
    res.status(201).json({ message: "Utilisateur créé avec succès" }); //message de succès
  } catch (error) {
    //en cas d'erreur
    res.status(500).json({ error: error.message }); //message d'erreur
  }
};
// Connexion
{
  /**Taper : JSON (application/json) ;Envoyer une requête de connexion : Méthode : POST
  {
  "email": "tonemail@.com",
  "password": "tonmotdepasse"
}
  */
}

const login = async (req, res) => {
  //fonction de connexion
 
  try {
    const { email, password } = req.body; //récupération des données de l'utilisateur
    const userc = await Userc.findOne({ email }); //recherche de l'utilisateur par email
    if (!userc)
      //si l'utilisateur n'existe pas
      return res.status(400).json({ message: "Utilisateur non trouvé" }); //message d'erreur

    const isMatch = await bcrypt.compare(password, userc.password); //comparer le mot de passe entré avec le mot de passe haché dans la base de données
    if (!isMatch)
      //si le mot de passe ne correspond pas
      return res.status(400).json({ message: "Mot de passe incorrect" }); //message d'erreur

    const token = jwt.sign({ id: userc._id }, process.env.JWT_SECRET, {
      //création du token
      expiresIn: "1h", //Le token expire après 1 heure
    });

    // Ajout des logs Vérifie si un token valide est affiché dans la console.
    console.log("Token généré :", token); //affichage du token
    console.log("Clé secrète utilisée :", process.env.JWT_SECRET); //affichage de la clé secrète
    //---
    res.status(200).json({ token, userc }); //envoi du token et de l'utilisateur
  } catch (error) {
    //en cas d'erreur
    res.status(500).json({ error: error.message }); //message d'erreur
  }
};
// Récupérer tous les utilisateurs
const getUsers = async (req, res) => {
  //fonction pour récupérer tous les utilisateurs
  try {
    //essayer
    const users = await Userc.find(); //récupérer tous les utilisateurs
    res.status(200).json(users); //envoyer les utilisateurs
  } catch (error) {
    //en cas d'erreur
    res.status(500).json({ error: error.message }); //message d'erreur
  }
};
// Récupérer un utilisateur par ID
const getUserById = async (req, res) => {
  //fonction pour récupérer un utilisateur par ID
  try {
    //essayer
    const user = await Userc.findById(req.params.id); //récupérer l'utilisateur par ID
    if (!user)
      //si l'utilisateur n'existe pas
      return res.status(404).json({ message: "Utilisateur non trouvé" }); //message d'erreur
    res.status(200).json(user); //envoyer l'utilisateur
  } catch (error) {
    //en cas d'erreur
    res.status(500).json({ error: error.message }); //message d'erreur
  }
};
// Mettre à jour un utilisateur
const updateUser = async (req, res) => {
  //fonction pour mettre à jour un utilisateur
  try {
    //essayer
    const { name, email, password, age } = req.body; //récupérer les données de l'utilisateur
    const user = await Userc.findByIdAndUpdate(
      //rechercher et mettre à jour l'utilisateur
      req.params.id, //ID de l'utilisateur
      { name, email, password, age }, //nouvelles données de l'utilisateur
      { new: true } //retourner le nouvel utilisateur mis à jour
    );
    if (!user)
      //si l'utilisateur n'existe pas
      return res.status(404).json({ message: "Utilisateur non trouvé" }); //message d'erreur
    res.status(200).json(user); //envoyer l'utilisateur
  } catch (error) {
    //en cas d'erreur
    res.status(500).json({ error: error.message }); //message d'erreur
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  //fonction pour supprimer un utilisateur
  try {
    //essayer
    const user = await Userc.findByIdAndDelete(req.params.id); //rechercher et supprimer l'utilisateur par ID
    if (!user)
      //si l'utilisateur n'existe pas
      return res.status(404).json({ message: "Utilisateur non trouvé" }); //message d'erreur
    res.status(200).json({ message: "Utilisateur supprimé avec succès" }); //message de succès
  } catch (error) {
    //en cas d'erreur
    res.status(500).json({ error: error.message }); //message d'erreur
  }
};

module.exports = {
  //exportation des fonctions
  register,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
