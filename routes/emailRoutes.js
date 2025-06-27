const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config(); // Charger les variables d'environnement

// Configurer le transporteur email (exemple avec Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true pour le port 465, false pour les autres
  auth: {
    //  user: 'alphadiaous@gmail.com', // Votre adresse Gmail complète
    //  pass: 'yxnn rffw kjgu negk' // Le mot de passe d'application généré
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Important pour contourner les erreurs de certificat
  },
});

router.post("/send-reference-email", async (req, res) => {
  const { to, reference, clientName, lastName } = req.body;

  try {
    const mailOptions = {
      from: '"Service Casier Judiciaire" <no-reply@casierjudiciair.gouv>',
      to: to,
      subject: "Votre référence de demande de casier judiciaire",
      html: `
     <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1A365D; border-bottom: 2px solid #D69E2E; padding-bottom: 10px;">Votre demande de casier judiciaire est enregistrée</h2>
  
  <p>Bonjour ${clientName} ${lastName}, </p>
  
  <p>Nous accusons réception de votre demande d'extrait de casier judiciaire n° <strong>${reference}</strong>.</p>
  
  <div style="background: #F7FAFC; padding: 20px; border-left: 4px solid #1A365D; margin: 25px 0; border-radius: 4px;">
    <p style="margin: 0 0 10px 0; font-weight: 600;">Pour suivre l'avancement de votre dossier :</p>
    
    <div style="margin: 15px 0; text-align: center;">
      <a href="https://casiergn.vercel.app/voir-mes-demandes?ref=${reference}" 
               
      style="background-color: #1A4D2E; color: white; padding: 12px 24px; 
                text-decoration: none; border-radius: 4px; font-weight: bold;
                display: inline-block;">
        SUIVRE MON DOSSIER
      </a>
    </div>
    
    <p style="font-size: 14px; color: #4A5568;">
      Ou copiez ce lien :<br>
      <span style="word-break: break-all;">https://casiergn.vercel.app/voir-mes-demandes?ref=${reference}</span>
    </p>
  </div>
  
  <p style="font-size: 15px;">
    <strong>Étapes à venir :</strong><br>
    1. Vérification des pièces jointes (2-3 jours ouvrés)<br>
    2. Traitement par le greffe<br>
  </p>
  
  <p style="font-size: 14px; color: #C53030; font-style: italic;">
    ⚠️ Cette référence est strictement personnelle. Ne la communiquez à personne.
  </p>
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
    <p>Pour toute question :</p>
    <p>
      📞 <a href="tel:+224 624 138 395" style="color: #1A365D;">+224 624 138 395</a><br>
      ✉️ <a href="mailto:contact@casierjudiciair.gouv" style="color: #1A365D;">contact@casierjudiciair.gouv</a>
    </p>
  </div>
  
  <p style="font-size: 12px; color: #718096; margin-top: 20px;">
    Ce message est envoyé automatiquement, merci de ne pas y répondre.
  </p>
</div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erreur envoi email:", error);
    res.status(500).json({ error: "Erreur lors de l'envoi de l'email" });
  }
});

//Pour là notificàtion de la demande si le stàtut devien terminé
// Configuration du transporteur email (à adapter selon votre configuration)
router.post("/send-status-email", async (req, res) => {
  try {
    const { email, reference, status, fullName } = req.body;
    console.log("Requête reçue pour l'email:", { email, reference, status });

    if (status !== "completed") {
      console.log("Statut non complet - pas d'email envoyé");
      return res.status(400).json({
        success: false,
        message: "Email de notification seulement pour le statut 'completed'",
      });
    }

   
    const mailOptions = {
      from: `"Service Casier Judiciaire" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `[${reference}] Votre casier judiciaire est prêt`,
      html: `
     <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
  <div style="background-color: #1A4D2E; color: white; padding: 20px;">
    <h2 style="margin: 0; font-size: 22px;">📄 Votre casier judiciaire est prêt</h2>
  </div>

  <div style="padding: 20px; color: #333;">
    <p style="font-size: 16px;">Bonjour <strong>${fullName}</strong>,</p>

    <p style="font-size: 15px; line-height: 1.6;">
      Nous avons le plaisir de vous informer que votre demande de casier judiciaire portant la référence
      <strong style="color: #1A4D2E;">${reference}</strong> a été traitée avec succès et est désormais <strong>prête à être récupérée</strong>.
    </p>

    <div style="background-color: #F7FAFC; border-left: 5px solid #1A4D2E; padding: 15px; margin: 20px 0; font-size: 15px;">
      <p><strong>📦 Mode de livraison :</strong> ${req.body.deliveryMethod || "Non spécifié"}</p>
    </div>

    <p style="font-size: 15px;">
      Si vous avez des questions ou si vous souhaitez planifier un retrait, n’hésitez pas à nous contacter.
    </p>

    <p style="margin-top: 25px;">
      Cordialement,<br>
      <strong>Le Service des casiers judiciaires</strong><br>
      ☎️ <a href="tel:+22462413889" style="color: #1A4D2E; text-decoration: none;">+224 625 888 145</a><br>
      ✉️ <a href="mailto:casier@service.gn" style="color: #1A4D2E; text-decoration: none;">casier@service.gn</a>
    </p>
  </div>

  <div style="background-color: #F0F4F8; padding: 15px; font-size: 13px; text-align: center; color: #666;">
    Ce message vous a été envoyé automatiquement. Merci de ne pas y répondre directement.
  </div>
</div>

      `,
    };

    console.log("Envoi de l'email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Email envoyé:", info.messageId);

    res.status(200).json({
      success: true,
      message: "Email de notification envoyé avec succès",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi de l'email de notification",
      error: error.message,
    });
  }
});
module.exports = router;
