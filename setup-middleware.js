const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require("express-session");
const KnexSessionStore = require('connect-session-knex')(session);


module.exports = server => {
  const sessionConfig = {
    name: "name",
    secret: "supersecret", //inproduction this would be a long hard to guess string
    cookie: {
      maxAge: 10 * 60 * 1000,
      secure: false,
      httpOnly: true
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStore({
    knex: require("./database/dbConfig.js"),
    tablename: "sessions",
    createtable: true,
    sidfieldname: "sid",
    clearInterval: 1000 * 60 * 60
  })
}
  server.use(helmet());
  server.use(express.json());
  server.use(cors());
  server.use(session(sessionConfig));
}
