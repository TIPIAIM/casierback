//àuthMiiddlewarec.js
const Session = require("../models/Session"); // en haut
require("dotenv").config();
const jwt = require("jsonwebtoken");

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

const authMiddlewarec = (req, res, next) => {
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
  checkBlacklistedToken,
  logoutMiddleware,
};
