const User = require('./auth.dao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = require('./auth.config');

exports.createUser = (req, res, next) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password)
  }

  User.create(newUser, (err, user) => {
    if (err && err.code === 11000) return res.send({ message: 'Email already exists' });
    if (err) return res.send({ message: 'Server error!' });
    const expiresIn = 60;
    const accessToken = jwt.sign({ id: user.id },
      SECRET_KEY, {
        expiresIn: expiresIn
      });
    const dataUser = {
      name: user.name,
      email: user.email,
      accessToken: accessToken,
      expiresIn: expiresIn
    }
    // response 
    res.send({ dataUser });
  });
}

exports.loginUser = (req, res, next) => {
  const userData = {
    email: req.body.email,
    password: req.body.password
  }
  User.findOne({ email: userData.email }, (err, user) => {
    if (err) return res.send({ message: 'Server error!' });

    if (!user) {
      // email does not exist
      res.send({ message: 'Something is wrong' });
    } else {
      const resultPassword = bcrypt.compareSync(userData.password, user.password);
      if (resultPassword) {
        const expiresIn = 60;
        const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: expiresIn });

        const dataUser = {
          name: user.name,
          email: user.email,
          accessToken: accessToken,
          expiresIn: expiresIn
        }
        res.send({ dataUser });
      } else {
        // password wrong
        res.send({ message: 'Something is wrong' });
      }
    }
  });
}

exports.datosUser = (req, res, next) => {
  let id = req.decoded.id
  console.log(id)
  
  User.findOne({ _id: id }, (err, user) => {
      if (err) return res.send({ message: 'Server error!' });

      if (!user) {
        // id does not exist
        res.send({ message: 'Something is wrong' });
      } 
      else {
        res.json({user : {name:user.name, email:user.email, createdAt: user.createdAt, updatedAt: user.updatedAt}});
      }
  });
}

exports.logoutUser = (req, res, next) => {
	res.json({'logout': 'ok'});
}
