// Mise à jour du modèle User
{
  /*const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Nouveau champ
  age: { type: Number, required: true },
});
// Hachage du mot de passe avant enregistrement
userSchema.pre("save", async function (next) {
  //
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
module.exports = mongoose.model("Userc", userSchema);
*/
}
// Mise à jour du modèle User avec bcryptjs
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Changé de bcrypt à bcryptjs

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  verificationCode: { type: String },
  isVerified: { type: Boolean, default: false },
});

// Hachage du mot de passe avant enregistrement
{/*userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    // Utilisation de bcryptjs au lieu de bcrypt
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});*/}
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


