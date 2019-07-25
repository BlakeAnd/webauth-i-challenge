const express = require('express');
const bcrypt = require("bcryptjs");
const model = require("./auth-model");
const authenticate = require("./authenticate.js");
//const KnexSessionStore = require('connect-session-knex')(session); //<<<<< GOTCHA pass the session using currying

const globalMiddleware = require("./setup-middleware.js");

const server = express();

globalMiddleware(server);


//server.use(express.json());
//server.use(session(sessionConfig));

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

server.post("/api/login",  (req, res) => {
  let { username, password } = req.body;

  model.findBy({ username })
  .first()
  .then(user => {
    if(user && bcrypt.compareSync(password, user.password)){
      req.session.username = user.username;
      res.json({
        message: `Welcome ${user.username}!`,
      });
    } else {
      res.status(401).json({ message: 'bad credentials' });
    }
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
server.get("/api/logout", (req, res ) => {
  if (req.session){
    req.session.destroy(err => {
      if(err) {
        res.status(500).json({message: "you're stuck here, error logging out"})
      } else {
        res.status(200).json({message: 'bye'})
      }
    })
  } else {
    res.status(200).json({message: "you weren't logged in lol"})
  }
})

module.exports = server;