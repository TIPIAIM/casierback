require("dotenv").config();
const jwt = require("jsonwebtoken");

const blacklistedTokens = [];

const checkBlacklistedToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (blacklistedTokens.includes(token)) {
    return res.status(401).json({ message: "Token invalide (déconnecté)" });
  }
  next();
};

const authMiddlewarec = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Accès refusé" });

  if (blacklistedTokens.includes(token)) {
    return res.status(401).json({ message: "Token blacklisté" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};

const logoutMiddleware = (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (token) {
    blacklistedTokens.push(token);
    console.log("🔒 Déconnexion effectuée. Token blacklisté :", token);
  } else {
    console.log("⚠️ Aucune autorisation trouvée pour la déconnexion.");
  }

  res.status(200).json({ message: "Déconnexion réussie" });
};

module.exports = {
  authMiddlewarec,
  checkBlacklistedToken,
  logoutMiddleware,
};
