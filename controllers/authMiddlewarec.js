//àuthMiiddlewarec.js
const Session = require("../models/Session"); // en haut
const User = require("../models/Userc"); // ← ici le bon nom de fichier et le bon modèle
const Demande = require("../models/demande"); // en haut de ton fichier !

require("dotenv").config();
const jwt = require("jsonwebtoken");

// Middleware : Autorise si admin OU propriétaire de la demande
const isAdminOrOwner = async (req, res, next) => {
  try {
    const user = req.user;
    const demandeId = req.params.id || req.params.demandeId || req.body.id;
    const demandeRef = req.params.reference;

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // Si c'est un admin, accès total
    if (user.role === "admin") return next();

    let demande;
    if (demandeId) {
      demande = await Demande.findById(demandeId);
    } else if (demandeRef) {
      demande = await Demande.findOne({ reference: demandeRef });
    }

    if (!demande) return res.status(404).json({ message: "Demande introuvable" });

    if (demande.userId.toString() === user._id.toString()) return next();

    return res.status(403).json({ message: "Non autorisé à accéder à cette demande" });
  } catch (e) {
    return res.status(500).json({ message: "Erreur autorisation", error: e.message });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Accès réservé à l’admin" });
  }
  next();
};
const blacklistedTokens = [];

const checkBlacklistedToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(); // No token, continue to next middleware
  }
  if (blacklistedTokens.includes(token)) {
    return res.status(401).json({ message: "Token invalide (déconnecté)" });
  }
  next();
};

{/*const authMiddlewarec = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token récupéré du cookie:", token);

  if (!token) {
    return res.status(401).json({ message: "Accès refusé. Token manquant." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};*/}
const authMiddlewarec = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token récupéré du cookie:", token);

  if (!token) {
    return res.status(401).json({ message: "Accès refusé. Token manquant." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // On va chercher le vrai user dans la base !
    const user = await User.findById(decoded._id || decoded.id); // <<=== IMPORTANT
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable." });
    }
    req.user = user; // <=== Maintenant, req.user est le vrai document utilisateur MongoDB
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};

const logoutMiddleware = async (req, res) => {
  const token = req.cookies.token;

  if (token) {
    blacklistedTokens.push(token);
    res.clearCookie("token");

    // 🔁 Mise à jour de la session dans la BDD
    await Session.findOneAndUpdate(
      { token },
      { disconnectedAt: new Date() },
      { new: true }
    );

    console.log("🔒 Déconnexion + horodatage sauvegardé");
    return res.status(200).json({ message: "Déconnexion réussie." });
  }

  return res.status(400).json({ message: "Aucun token à supprimer." });
};


module.exports = {
  authMiddlewarec,
  isAdmin,
  checkBlacklistedToken,
  logoutMiddleware,
  isAdminOrOwner,
};
