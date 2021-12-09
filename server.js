//2.login username with password

let express = require('express');

let bodyParser = require('body-parser');

var http = require('http');

let mysql = require('mysql');

let cors = require('cors');

require('dotenv').config();

var app = express();

app.use(bodyParser.json());

app.use(express.json());

var path = require('path');

app.use(
  bodyParser.urlencoded({ extended: false })
);

var cookieParser = require('cookie-parser');
app.use(cookieParser(process.env.COOKIE_SECRET));


const session = require('express-session');
let {
  connection,
  sessionStore,
} = require('./db.js');

app.use(
  session({
    sessionname: 'login',
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    store: sessionStore,
    cookie: {
      maxAge: 3600000 * 24 * 365 * 999,
      httpOnly: true,
      sameSite: true,
      signed: true,
      path: '/',
    },
  })
);





connection.connect(function (err) {
  if (!err) {
    console.log(
      'ESTABLISHED THE CONNECTION :DATABASE IS CONNECTED'
    );
  } else {
    console.log(err);
    console.log(
      'CONNECTION FAILED:DATABASE NOT CONNECTED'
    );
  }
});

let signup=require('./api/signup');
app.use('/api/signup',signup);


let signin=require('./api/signin');
app.use('/api/signin',signin);




var port = parseInt(process.env.PORT);

app.listen(port, function (error) {
  if (error) throw error;
  console.log(
    `SERVER CONNECTION SUCCESSFULLY ON  PORT ${port}`
  );
});
