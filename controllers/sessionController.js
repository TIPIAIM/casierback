const Session = require("../models/Session");
const Userc = require("../models/Userc");

exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find().populate("userId", "email");

    // Regrouper les sessions par utilisateur avec nombre total de connexions
    const userMap = new Map();

    sessions.forEach((session) => {
      const uid = session.userId._id.toString();

      if (!userMap.has(uid)) {
        userMap.set(uid, {
          id: uid,
          identifiant: session.userId.email,
          nombreConnexion: 0,
          connexions: [],
        });
      }

      const entry = userMap.get(uid);
      entry.nombreConnexion += 1;
      entry.connexions.push({
        token: session.token,
        connectedAt: session.connectedAt,
        disconnectedAt: session.disconnectedAt,
      });
    });

    const result = Array.from(userMap.values());
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des connexions.", error });
  }
};

