const demande = require("../models/demande");
const fs = require("fs");
const path = require("path");

exports.createdemande = async (req, res) => {
  try {
    // Vérifier que les fichiers ont été uploadés
    if (!req.files || !req.files.piece1 || !req.files.piece2) {
      return res.status(400).json({
        success: false,
        message: "Les deux pièces justificatives sont requises",
      });
    }

    // Récupérer les chemins des fichiers
    const piece1Path = req.files.piece1[0].path;
    const piece2Path = req.files.piece2[0].path;

    // Extraire les données fs.readFile
    const { deliveryMethod, personalInfo } = req.body;

    // Créer la nouvelle demande
    const newdemande = new demande({
      deliveryMethod,
      personalInfo:
        typeof personalInfo === "string"
          ? JSON.parse(personalInfo)
          : personalInfo,
      contactInfo: {
        piece1: piece1Path,
        piece2: piece2Path,
      },
    });

    await newdemande.save();

    res.status(201).json({
      success: true,
      message: "Demande créée avec succès",
      reference: newdemande.reference,
      data: {
        ...newdemande.toObject(),
        piece1Url: `/uploads/${path.basename(piece1Path)}`,
        piece2Url: `/uploads/${path.basename(piece2Path)}`,
      },
    });
  } catch (error) {
    console.error("Error creating demande:", error);

    // Nettoyer les fichiers uploadés en cas d'erreur
    if (req.files) {
      Object.values(req.files).forEach((files) => {
        files.forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      });
    }

    let errorMessage = "Erreur serveur lors de la création de la demande";
    if (error.name === "ValidationError") {
      errorMessage = "Données de validation invalides";
    } else if (error.code === "LIMIT_FILE_SIZE") {
      errorMessage = "La taille d'un fichier dépasse la limite autorisée (5MB)";
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.getdemande = async (req, res) => {
  try {
    const foundDemande = await demande.findOne({
      reference: req.params.reference,
    });

    if (!foundDemande) {
      return res.status(404).json({
        success: false,
        message: "Demande non trouvée",
      });
    }

    // Construire la réponse avec les URLs des fichiers
    const responseData = {
      ...foundDemande.toObject(),
      piece1Url: `/uploads/${path.basename(foundDemande.contactInfo.piece1)}`,
      piece2Url: `/uploads/${path.basename(foundDemande.contactInfo.piece2)}`,
    };

    res.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error getting demande:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération de la demande",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
exports.getAll = async (req, res) => {
  try {
    const demandes = await demande.find();

    // Ajouter les URLs pour chaque demande avec vérification des pièces jointes
    const demandesWithUrls = demandes.map(dem => {
      const responseDemande = {
        ...dem.toObject(),
        // Vérifier si piece1 existe avant de créer l'URL
        piece1Url: dem.contactInfo?.piece1 
          ? `/uploads/${path.basename(dem.contactInfo.piece1)}` 
          : null,
        // Vérifier si piece2 existe avant de créer l'URL
        piece2Url: dem.contactInfo?.piece2 
          ? `/uploads/${path.basename(dem.contactInfo.piece2)}` 
          : null
      };
      return responseDemande;
    });

    res.status(200).json({
      success: true,
      count: demandes.length,
      data: demandesWithUrls
    });
  } catch (error) {
    console.error("Error getting all demandes:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des demandes",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
// ... (les autres méthodes existantes)

exports.getId = async (req, res) => {
  try {
    console.log(`Recherche demande avec ID: ${req.params.id}`);
    const foundDemande = await demande.findById(req.params.id);
    
    if (!foundDemande) {
      console.log("Demande non trouvée");
      return res.status(404).json({
        success: false,
        message: "Demande non trouvée",
      });
    }

    const responseData = {
      ...foundDemande.toObject(),
      piece1Url: foundDemande.contactInfo?.piece1 
        ? `/uploads/${path.basename(foundDemande.contactInfo.piece1)}` 
        : null,
      piece2Url: foundDemande.contactInfo?.piece2 
        ? `/uploads/${path.basename(foundDemande.contactInfo.piece2)}` 
        : null
    };

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error("Erreur lors de la récupération:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
};
// ... (les autres méthodes existantes)
// Dans votre route API

exports.updateDemande = async (req, res) => {
  try {
    const { id } = req.params;
    const { personalInfo, deliveryMethod, status } = req.body;

    // Vérifier que la demande existe
    const existingDemande = await demande.findById(id);
    if (!existingDemande) {
      return res.status(404).json({
        success: false,
        message: "Demande non trouvée",
      });
    }

    // Mettre à jour les champs
    existingDemande.personalInfo = personalInfo || existingDemande.personalInfo;
    existingDemande.deliveryMethod = deliveryMethod || existingDemande.deliveryMethod;
    existingDemande.status = status || existingDemande.status;

    // Sauvegarder les modifications
    const updatedDemande = await existingDemande.save();

    res.status(200).json({
      success: true,
      message: "Demande mise à jour avec succès",
      data: updatedDemande
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
// Dans controllers/demandeController.js
exports.deleteDemande = async (req, res) => {
  try {
    const { id } = req.params;

    // Trouver et supprimer la demande
    const deletedDemande = await demande.findByIdAndDelete(id);

    if (!deletedDemande) {
      return res.status(404).json({
        success: false,
        message: "Demande non trouvée",
      });
    }

    // Supprimer les fichiers associés
    if (deletedDemande.contactInfo?.piece1 && fs.existsSync(deletedDemande.contactInfo.piece1)) {
      fs.unlinkSync(deletedDemande.contactInfo.piece1);
    }
    if (deletedDemande.contactInfo?.piece2 && fs.existsSync(deletedDemande.contactInfo.piece2)) {
      fs.unlinkSync(deletedDemande.contactInfo.piece2);
    }

    res.status(200).json({
      success: true,
      message: "Demande supprimée avec succès",
      data: deletedDemande
    });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la suppression",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
exports.getByReference = async (req, res) => {
  try {
    console.log(`Recherche demande avec référence: ${req.params.reference}`);
    const foundDemande = await demande.findOne({ reference: req.params.reference });
    
    if (!foundDemande) {
      console.log("Demande non trouvée");
      return res.status(404).json({
        success: false,
        message: "Aucune demande trouvée avec cette référence",
      });
    }

    const responseData = {
      ...foundDemande.toObject(),
      piece1Url: foundDemande.contactInfo?.piece1 
        ? `/uploads/${path.basename(foundDemande.contactInfo.piece1)}` 
        : null,
      piece2Url: foundDemande.contactInfo?.piece2 
        ? `/uploads/${path.basename(foundDemande.contactInfo.piece2)}` 
        : null
    };

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error("Erreur lors de la récupération par référence:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la recherche par référence",
      error: error.message
    });
  }
};