// Mise à jour du modèle User

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Changé de bcrypt à bcryptjs

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: {
    type: String,
    default: "", // ou une URL générique/avatar par défaut
  },
  verificationCode: { type: String },
  verificationCodeExpiresAt: { type: Date }, // ✅ Nouveau champ
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ["admin", "user"], default: "user" }, // ✅ Ajout du champ rôle
});

// Hachage du mot de passe avant enregistrement
 
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Userc", userSchema);
