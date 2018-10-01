'use strict';

require('dotenv').config();

var express = require('express'),
  httpApp = express(),
  app = express(),
  http = require('http'),
  fs = require('fs'),
  bodyParser = require('body-parser'),
  enrouten = require('express-enrouten'),
  port = process.env.HTTP_PORT || 8080;
const passport = require('passport');

require('./lib/passport');

// app.set('views', __dirname + '/views')
// app.engine('jade', require('jade').__express)
// app.set('view engine', 'jade')
// app.get('/', function (req, res) {
//   res.render('index')
// })


app.use(function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


app.use(/^\/(?=api\/).*/, passport.authenticate('jwt', { session: false }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(enrouten({ directory: 'controllers' }));

// app.get("/OneSignalSDKWorker.js", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "public", "OneSignalSDKWorker.js"));
// });
app.listen(port, function () {
  console.log('Listening on port ' + port)
})

module.exports = app;

