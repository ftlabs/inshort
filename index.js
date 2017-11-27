const dotenv = require('dotenv').config({ silent: process.env.NODE_ENVIRONMENT === 'production' });
const package = require('./package.json');
const debug = require('debug')(`${package.name}:index`);
const express = require('express');
const path = require('path');
const app = express();
const validateRequest = require('./helpers/check-token');
const summary = require('./routes/summary');
const hbs = require('hbs');

// view engine setup
hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


var requestLogger = function (req, res, next) {
  debug("RECEIVED REQUEST:", req.method, req.url);
  next(); // Passing the request to the next handler in the stack.
}

app.use(requestLogger);

// these routes do *not* have s3o
app.use('/static', express.static('static'));
app.use('/app', express.static('app'));

const TOKEN = process.env.TOKEN;
if (!TOKEN) {
  throw new Error('ERROR: TOKEN not specified in env');
}

// these route *do* use s3o
app.set('json spaces', 2);
if (process.env.BYPASS_TOKEN !== 'true') {
  app.use(validateRequest);
}



//Core Routes
app.use('/summary', summary);

// ---

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/app/dist/index.html'));
});

// app.use('/', (req, res) => {
//   res.render('index');
// })

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

//---

function startListening() {
  app.listen(process.env.PORT, function () {
    console.log('Server is listening on port', process.env.PORT);
  });
}
//---
startListening();

module.exports = app;