const express = require("express");
const app = express();
const port = process.env.PORT || 2027;
const Basede = require("./Basededon");
Basede(); //connexion a la base de donnée

app.get("/", (req, res) => {
  res.send("Bienvenue dans mon serveur");
});
app.listen(port, () => {
  console.log(` serveur demarré sur http://localhost:${port}`);
});
