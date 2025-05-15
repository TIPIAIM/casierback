// models/TokenBlacklist.js
import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  loginAt: { type: Date, required: true },
  logoutAt: { type: Date, required: true },
  sessionDuration: { type: Number, required: true }, // en secondes
});

export default mongoose.model("TokenBlacklist", tokenBlacklistSchema);

{/**
     2. Lors de la connexion, stocker la date de connexion
Quand l'utilisateur se connecte avec succès (dans /api/auth/login), ajoute la date de login dans le token ou en mémoire :

js
Copier
Modifier
// routes/auth.js ou controllers/authController.js
    
    */}