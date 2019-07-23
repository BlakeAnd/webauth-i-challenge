const bcrypt = require('bcryptjs');

const model = require("./auth-model.js");

function authenticate(req, res, next) {
  let password = "";
  let username = "";
  console.log("body", req.body);
  console.log("headers", req.headers);
  if(req.body.hasOwnProperty("username")){
    password = req.body.password;
    username = req.body.username;
  } else if(req.headers.hasOwnProperty("username")){
    password = req.headers.password;
    username = req.headers.username;
  }
  console.log("password:", password);
  console.log("username:", username);
  model.findBy({ username })
  .first()
  .then(user => {
    if(user && bcrypt.compareSync(password, user.password)){
      next();
    } else {
      res.status(401).json({ message: 'bad credentials' });
    }
  })
  .catch(error => {
    res.status(500).json({error: error.message});
  })
}

module.exports = authenticate;