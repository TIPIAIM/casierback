//pour tester l'envoie d'incription

const request = require("supertest");
const app = require("../app");
const chai = require("chai");
chai.should();

describe("AUTH - Enregistrement", () => {
  it("devrait enregistrer un utilisateur", function (done) {
    this.timeout(5000); // ⏱️ augmente le délai

    const uniqueEmail = `soumanneuf@gmail.com`;

    request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: uniqueEmail,
        password: "123456789",
      })
      .expect(201)
      .end((err, res) => {
        if (err) {
          console.log("Erreur pendant la requête :", err);
          return done(err); // indique l’échec
        }

        console.log("Réponse reçue :", res.body);
        res.body.should.have.property("success").eql(true);
        done(); // test réussi
      });
  });
});
