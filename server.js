const express = require('express');
const bcrypt = require("bcryptjs");
const model = require("./auth-model");
const authenticate = require("./authenticate.js");
const server = express();

server.use(express.json());

server.post("/api/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 15);
  user.password = hash;

  model.add(user)
  .then(saved => {
    res.status(201).json(saved);
  })
  .catch(error => {
    res.status(500).json(error);
  })
});

server.post("/api/login", authenticate, (req, res) => {
  let { username, password } = req.body;

  model.findBy({ username })
  .first()
  .then(user => {
    res.json(user);
  })
  .catch(error => {
    res.status(500).json(error);
  })
});
server.get("/api/users", authenticate, (req, res) => {
  const { username, password } = req.headers;
  
  model.find()
  .then(users => {
    res.json(users);
  })
  .catch(err => res.send(err));
})

module.exports = server;