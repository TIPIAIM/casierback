const mongoose = require("mongoose");

const demandeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Userc",        // 👈 référence au modèle User
    required: true      // 👈 important pour la sécurité !
  },

  deliveryMethod: {
    type: String,
    required: true,
    enum: ["court", "mail", "email","postal" ],
  },
  
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    birthPlace: { type: String, required: true },
    firstName1: { type: String, required: true },
    firstName2: { type: String },
    situationFamiliale: {
      type: String,
      enum: ["célibataire", "marié(e)", "divorcé(e)", "veuf(ve)"],
      required: true,
    },
    profession: { type: String, required: true },
    pays: {
      type: String,
      enum: ["Guinée", "Maroc", "France", "Espagne", "Belgique", "Sénégal"],
      required: true,
    },
    nationalite: {
      type: String,
      enum: [
        "Guinéenne",
        "Marocaine",
        "Française",
        "Espagnole",
        "Belge",
        "Sénégalaise",
      ],
      required: true,
    },
    passport: { type: String, required: true },
    payss: {
      type: String,
      enum: ["Guinée", "Maroc", "France", "Espagne", "Belgique", "Sénégal"],
      required: true,
    },
    villecommune: { type: String, required: true },

    address: { type: String, required: true },
    postalCode: { type: String },
    city: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  contactInfo: {
    piece1: {
      type: String, // Chemin du fichier stocké
      required: true,
    },
    piece2: {
      type: String, // Chemin du fichier stocké
      required: true,
    },
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "processing", "completed", "rejected"],
  },
  reference: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

demandeSchema.pre("save", async function (next) {
  if (!this.reference) {
    const count = await this.constructor.countDocuments();
    this.reference = `CR-${Date.now().toString().slice(-6)}-${(count + 1)
      .toString()
      .padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Demande", demandeSchema);
