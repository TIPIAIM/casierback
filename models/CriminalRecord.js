const mongoose = require('mongoose');

const CriminalRecordSchema = new mongoose.Schema({
  reference: {
    type: String,
     
  },
    carteidentite: {
        type: String,
        required: true
    },
  courtsTribunaux: {//cest pàs là pàin dutliser le enum
    type: String,
    required: true,
    
  },
  dateCondamnations: {
    type: Date,
    required: true
  },
  natureDesCrimes: {
    type: String,
    required: true
  },
  dateCrimesOuDelits: {
    type: Date,
    required: true
  },
  dureeDePeine: {
    type: String,
    required: true
  },
  dateMiseEnPrison: {
    type: Date,
    required: true
  },
  observations: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Générer une référence avant sauvegarde
CriminalRecordSchema.pre('save', function(next) {
  if (!this.reference) {
    this.reference = `CR-${Date.now().toString(36).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('CriminalRecord', CriminalRecordSchema);