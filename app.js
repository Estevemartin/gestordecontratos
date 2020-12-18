require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const session    = require("express-session");
const path = require('path');
const MongoStore = require("connect-mongo")(session);
const app_name = require('./package.json').name;
const fs=require('fs');
const app = express();

// require configurations
require('./cfg/db-cfg');
const config = require('./cfg/config.js');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

//Registrar varis partials
var partialsDir = __dirname + '/views/partials';
var filenames = fs.readdirSync(partialsDir);
filenames.forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

// Middleware Setup ¿¿¿¿¿QUE HACE ESTO?????
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
      // ttl: 180
    }),
    resave: true,
    saveUninitialized: false
  }));

const router = require('./routes');

app.use(config.baseUrl, router);
// app.use('/', index);


module.exports = app;