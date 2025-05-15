const CriminalRecord = require("../models/CriminalRecord");

exports.createRecord = async (req, res) => {
  try {
    const {
      carteidentite,
      courtsTribunaux,
      dateCondamnations,
      natureDesCrimes,
      dateCrimesOuDelits,
      dureeDePeine,
      dateMiseEnPrison,
      observations,
    } = req.body;

    const newRecord = new CriminalRecord({
      carteidentite,
      courtsTribunaux,
      dateCondamnations: new Date(dateCondamnations),
      natureDesCrimes,
      dateCrimesOuDelits: new Date(dateCrimesOuDelits),
      dureeDePeine,
      dateMiseEnPrison: new Date(dateMiseEnPrison),
      observations,
    });

    await newRecord.save();

    res.status(201).json({
      success: true,
      message: "Dossier criminel enregistré avec succès",
      data: newRecord,
    });
  } catch (error) {
    console.error("Erreur lors de la création du dossier:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la création du dossier",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
// controllers/criminalRecordController.js
exports.deleteRecord = async (req, res) => {
  try {
    const deletedRecord = await CriminalRecord.findByIdAndDelete(req.params.id);
    if (!deletedRecord) {
      return res.status(404).json({ success: false, message: "Enregistrement non trouvé" });
    }
    res.json({ success: true, message: "Enregistrement supprimé" });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la suppression",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
exports.getAllRecords = async (req, res) => {
  try {
    const records = await CriminalRecord.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des dossiers:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des dossiers",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
