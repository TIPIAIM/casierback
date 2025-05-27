//pour gerer les sessions dutilisateur dans une application Node.js avec Mongoose, nous allons créer un modèle de session. Ce modèle permettra de stocker les informations de session des utilisateurs, telles que l'ID de l'utilisateur, le token de session, et les timestamps pour la connexion et la déconnexion.
// là nous serons  àu couràn de controller les connexion et deconnexion les àbut , ...

const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Userc",
    required: true,
  },
  token: { type: String, required: true },
  connectedAt: { type: Date, default: Date.now },
  disconnectedAt: { type: Date, default: null },
});

module.exports = mongoose.model("Session", sessionSchema);
