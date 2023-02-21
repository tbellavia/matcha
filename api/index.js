const express = require("express");

const app = express();

app.listen(3000, () => {
  console.log("Serveur démarré (http://localhost:3000/) !");
});

app.get("/", (req, res) => {
  res.send("Bonjour le monde...");
});

app.get("/user", (req, res) => {
  res.json({
    username: "tony",
    age: 23
  })
})

