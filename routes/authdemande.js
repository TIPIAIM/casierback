//demànderoute.js

const express = require("express");
const router = express.Router();
const demandeController = require("../controllers/demandeController");
const upload = require("../controllers/upload");
const { authMiddlewarec, isAdminOrOwner,isAdmin  } = require("../controllers/authMiddlewarec");
 
router.post("/",authMiddlewarec, upload, demandeController.createdemande);
router.get("/", authMiddlewarec, isAdmin, demandeController.getAll);
//router.get("/:id", demandeController.getId); // Nouvelle route
router.get("/by-id/:id",authMiddlewarec,isAdminOrOwner, demandeController.getId); // Route pour ID
router.get("/by-reference/:reference",authMiddlewarec,isAdminOrOwner, demandeController.getByReference); // Nouvelle route
router.put("/:id", authMiddlewarec, isAdminOrOwner, demandeController.updateDemande); // Nouvelle route pour la mise à jour
router.delete("/:id", authMiddlewarec, isAdminOrOwner, demandeController.deleteDemande); // Nouvelle route pour la suppression
// routes/criminalRecord.js
module.exports = router;
