const express = require("express");
let router = express.Router();
let { connection } = require("../db");
let randomnumbers = require("../randomnumber/randomnumbers");
require("dotenv").config();
const { genSaltSync, hashSync, compareSync } = require("bcrypt");

//---------------------------------------create account-------------------------------------------------------//

usertable = (user_id, username, password, telephone, access_level) => {
  return new Promise((resolve, reject) => {
    const salt = genSaltSync(10);
    const Hashpassword = hashSync(password, 10);
    var sql =
      "insert into usertable(user_id,username,password,telephone,access_level) values(?,?,?,?,?)";
    connection.query(
      sql,
      [user_id, username, Hashpassword, telephone, access_level],
      (err, results) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(results);
        }
      }
    );
  });
};

router.post("/signup", async (req, res) => {
  try {
    let user_id = randomnumbers(10);
    username = req.body.username;
    password = req.body.password;
    telephone = req.body.telephone;
    access_level = req.body.access_level;

    let register = await usertable(
      user_id,
      username,
      password,
      telephone,
      access_level
    );
    res.status(200).send(register);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;