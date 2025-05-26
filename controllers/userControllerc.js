//userControllerc.js

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

const Userc = require("../models/Userc");

const nodemailer = require("nodemailer");

// Nodemailer configuration (replace with your actual credentials)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "alphadiaous@gmail.com", // Replace with your email
    pass: "yxnnrffwkjgunegk", // Replace with your password or app password
  },
});

const register = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    const usercExists = await Userc.findOne({ email });
    if (usercExists) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const verificationCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();

    const newUser = new Userc({
      name,
      email,
      password, // brut
      age,
      verificationCode,
    });

    await newUser.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Code de vérification",
      html: `<p>Voici votre code de vérification : <b>${verificationCode}</b></p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Échec de l'envoi du mail" });
      }
      res.status(201).json({
        message: "Inscription réussie. Vérifiez votre email.",
        success: true,
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { verificationCode } = req.body;

    // Find user with matching verification code
    const user = await Userc.findOne({ verificationCode: verificationCode });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Update user to set verified to true and remove verification code
    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Email verified successfully",
      success: true,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  try {
    console.log("req.body:", req.body);
    const { email, password } = req.body;
    const userc = await Userc.findOne({ email, isVerified: true });

    if (!userc) {
      return res
        .status(400)
        .json({ message: "Utilisateur non trouvé ou non vérifié" });
    }

    const isMatch = await userc.comparePassword(password);
    console.log("Le Password match bien:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Mot de passe incorrect. Veuillez vérifier votre email et réessayer.",
      });
    }

    const token = jwt.sign(
      { id: userc._id, email: userc.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("✅ Token JWT généré :", token);
    res.status(200).json({
      token: token,
      userc: userc,
      message: "Connexion réussie",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const user = await Userc.findByIdAndDelete(req.params.id); //réchercher et supprimer l'utilisateur par ID
    if (!user)
      //si l'utilisateur n'existe pas
      return res.status(404).json({ message: "Utilisateur non trouvé" }); //message d'erreur
    res.status(200).json({ message: "Utilisateur supprimé avec succès" }); //message de succès
  } catch (error) {
    //en cas d'erreur
    res.status(500).json({ error: error.message }); //message d'erreur
  }
};

const loginAfter2FA = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Userc.findOne({ email, isVerified: true });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Utilisateur non trouvé ou non vérifié" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token: token, message: "Connexion réussie" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  verifyEmail,
  loginAfter2FA,
};
