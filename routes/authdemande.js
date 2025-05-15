const express = require("express");
const router = express.Router();
const demandeController = require("../controllers/demandeController");
const upload = require("../controllers/upload");

router.post("/", upload, demandeController.createdemande);
router.get("/", demandeController.getAll);
//router.get("/:id", demandeController.getId); // Nouvelle route
router.get("/by-id/:id", demandeController.getId); // Route pour ID
router.get("/by-reference/:reference", demandeController.getByReference); // Nouvelle route
router.put("/:id", demandeController.updateDemande); // Nouvelle route pour la mise à jour
router.delete("/:id", demandeController.deleteDemande); // Nouvelle route pour la suppression
// routes/criminalRecord.js
module.exports = router;
