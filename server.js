const path = require('path');

var express = require('express'),
  bodyParser = require('body-parser'),
  app = express(),
  port = process.env.PORT || 4000;

var fetch = require('node-fetch');
var SECRET_KEY = "put secret here";

// enable CORS using npm package
var cors = require('cors');
app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// verify reCAPTCHA response
app.post('/verify', (req, res) => {
  var VERIFY_URL = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${req.body['g-recaptcha-response']}`;
  return fetch(VERIFY_URL, { method: 'POST' })
    .then(res => res.json())
    .then(json => res.send(json));
});

// request handlers
/*app.get('/', (req, res) => {
  res.status(200).json({ message: 'Clue Mediator' });
});*/

app.listen(port, () => {
  console.log('Server started on: ' + port);
});