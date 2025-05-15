const express = require("express");

const app = express();
const port = process.env.PORT || 2027;
const Basede= require("./Basededon");
Basede();
app.get("/", (req, res) => {
  res.send("bienvenue dans mon serveur ");
});
app.listen(port, () => {
  console.log(` serveur demarré sur http://localhost:${port}`);
});

//;

//c'est la cnstante qui contient le module de la base de donnée //2
//const connecteralabasededonner = require("./BasedeDonner2"); //2 la varibl et fichier bd de dant
//connecteralabasededonner(); //2
