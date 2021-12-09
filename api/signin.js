const express = require('express');
const router = express.Router();
const { connection } = require('../db.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const axios = require('axios')
const {
  compareSync,
  hashSync,
} = require('bcrypt');

require('dotenv').config()


//-----------------------------------------------login using username and password----------------------------------------//

userlogin = (username, password) => {

  return new Promise((resolve, reject) => {
    var sql =
      'select password,accessLevel,user_id from usertable where username=?';
    connection.query(
      sql,
      username,
      (error, results) => {
        if (error) {
          return reject({ message: "unexpected error" });
        } else {
          if (results.length > 0) {
            let access_level =
              results[0].accessLevel;
            let user_id = results[0].user_id;

            if (results.length > 0) {
              const compare = compareSync(
                password,
                results[0].password
              );
              console.log(compare)
              if (compare) {
                const user = { username, password };
                const date = new Date();

                const token = jwt.sign(
                  user,
                  process.env.TOKENSECRET,
                  { expiresIn: '1hr' }
                );
                const response = {
                  message: 'login success',
                  
                };
                
                return resolve(response);
              } else {
                return reject({ message: "invalid password" });
              }
            } else {
              return reject({ message: "No user with this username" });
            }
          }
          else {
            return reject({ message: "NO SUCH USERS" })
          }
        }
      }
    );
  });
};

const schema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().min(8).required(),
  token: Joi.string().required()
});



router.post('/login', async (req, res) => {
  
  const { error } = schema.validate(
    req.body.payload
  );

  if (error) {
    return res.status(400).send(error.message);
  } else {
    try {
     
      
      let token = req.body.payload.token
     
      axios
        .post(`https://www.google.com/recaptcha/api/siteverify?secret=6LdvehMbAAAAACU19I33oLABwMOsgxeJn0slTIzS&response=${token}`)
        .then(async res2 => {

          if (res2.data.score > 0.4) {

            const username = req.body.payload.username.trim(),
              password =
                req.body.payload.password.trim()
                + process.env.PEPPER;

            const login = await userlogin(
              username,
              password
            );
          
            
            
            
           
            res
              .status(200)
              .cookie('login', login.token, {
                sameSite: true,
                httpOnly: true,
                Secure: true,
                expires: new Date(
                  new Date().getTime() + 1000 * 60 * 60 * 24
                ),
                signed: true,
                path: '/',
              })
              .send(login);

          }
          else {
          
            res.status(401).send({ message: "recaptcha verification failed" })
          }
        })
        .catch(error => {
          console.log(error);

          res.status(401).send({ message: "invalid credientials" })
        })

    } catch (error) {
      res
        .status(400)
        .send(error);
    }
  }
});

module.exports=router;
