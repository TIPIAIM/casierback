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

module.exports = router;
