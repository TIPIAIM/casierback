//userControllerc.js

{
  /**
 un contrôleur d'authentification pour une application Node.js. Il gère l'inscription,
   la connexion, la récupération, la mise à jour et la suppression des utilisateurs. 
  Il utilise JWT (JSON Web Token) pour gérer l'authentification et bcrypt pour hacher les mots de passe
  */
}

const Session = require("../models/Session"); // tout en haut
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
    const { name, email, password } = req.body;

    // Génération du code et de son expiration (15 minutes)
    const verificationCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
    const verificationCodeExpiresAt = new Date(Date.now() + 1 * 60 * 1000); // 15 * 60 * 1000 = 15 min

    // Recherche d’un utilisateur existant
    let user = await Userc.findOne({ email });

    if (user) {
      if (user.isVerified) {
        // Si déjà vérifié, on refuse l’inscription
        return res.status(400).json({ message: "Email déjà vérifié" });
      }
      // Si code non encore expiré, on demande de vérifier l’email existant
      if (user.verificationCodeExpiresAt > new Date()) {
        return res.status(400).json({
          message:
            "Un code vous a déjà été envoyé votre boîte mail alors attendez l’expiration avant d'utiliser à nouveau ce mail.",
        });
      }
      // Le code existant a expiré : on met à jour l’utilisateur avec un nouveau code
      user.name = name;
      user.password = password; // pensez à mettre en place un hook pre-save pour hasher !
      user.verificationCode = verificationCode;
      user.verificationCodeExpiresAt = verificationCodeExpiresAt;
      await user.save();
    } else {
      // Nouvel utilisateur : on crée un nouveau document
      user = new Userc({
        name,
        email,
        password, // idem hashing en pre-save
        verificationCode,
        verificationCodeExpiresAt,
      });
      await user.save();
    }

    // Envoi du mail de vérification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Code de vérification",
      html: `<p>Voici votre code de vérification : <b>${verificationCode}</b></p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Échec de l'envoi du mail" });
      }
      res.status(201).json({
        message:
          "Code de vérification envoyé. Vérifiez votre email. Si vous n’avez rien reçu, recommencez après expiration du précédent code.",
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
    if (user.verificationCodeExpiresAt < new Date()) {
      return res
        .status(400)
        .json({ message: "Code expiré. Veuillez vous réinscrire." });
    }
    // Update user to set verified to true and remove verification code
    user.isVerified = true;
    user.verificationCode = undefined;

    user.verificationCodeExpiresAt = undefined;
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userc = await Userc.findOne({ email, isVerified: true });

    if (!userc) {
      return res
        .status(400)
        .json({ message: "Utilisateur non trouvé ou non vérifié" });
    }

    const isMatch = await userc.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: userc._id, email: userc.email, role: userc.role }, // Inclure le rôle dans le token
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // Enregistrer la session
    await Session.create({
      userId: userc._id,
      token: token,
      connectedAt: new Date(),
    });

    // Stocker le token dans un cookie sécurisé
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1h
    });
    console.log("Cookie défini avec le token:", token);

    // Pas besoin de renvoyer le token dans la réponse
    res.status(200).json({
      user: {
        id: userc._id,
        name: userc.name,
        email: userc.email,
        role: userc.role,
      },
      message: "Connexion réussie",
      redirectTo: userc.role === "admin" ? "/adminmere" : "/adminfils",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Étape 3 : Middleware pour sécuriser les routes admin
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Accès refusé : administrateur uniquement." });
  }
  next();
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

    // Stocker dans cookie sécurisé
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      message: "Connexion réussie après double authentification",
    });
    console.log("Cookie défini avec le token:", token);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  isAdmin,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  verifyEmail,
  loginAfter2FA,
};
