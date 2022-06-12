const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded // middleware

app.use(require('./routes/index'));
app.use(express.static(path.join(__dirname, 'public' )));