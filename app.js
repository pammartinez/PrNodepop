'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer');
const configAnuncios = require('./local_config').anuncios;
const { v4: uuidv4 } = require('uuid');

// Definimos multer 
const storage = multer.diskStorage({
  // destino de todos los archivos a subir
  destination: function (req, file, cb) {
    cb(null, path.join('public/', configAnuncios.imagesURLBasePath))
  },
  // renombra el archivo con esta funcion
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage });

/* jshint ignore:start */
const db = require('./lib/connectMongoose');
/* jshint ignore:end */

// Cargamos las definiciones de todos nuestros modelos
require('./models/Anuncio');
require('./models/Usuario');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Setup de i18n
 */
const i18n = require('./lib/i18nConfigure')();
app.use(i18n.init);

// Global Template variables
app.locals.title = 'NodePop';

// Librerias propias
const loginController = require('./routes/loginController');
const jwtAuth = require('./lib/jwtAuth');

// Web
app.use('/', require('./routes/index'));
app.use('/anuncios', require('./routes/anuncios'));
app.use('/change-locale', require('./routes/change-locale'));

// API v1
app.post('/apiv1/authenticate', loginController.postJWT);
app.use('/apiv1/anuncios', jwtAuth(), upload.single('foto'), require('./routes/apiv1/anuncios'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  
  if (err.array) { // validation error
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPI(req) ?
      { message: 'not valid', errors: err.mapped()}
      : `not valid - ${errInfo.param} ${errInfo.msg}`;
  }

  // establezco el status a la respuesta
  err.status = err.status || 500;
  res.status(err.status);

  // si es un 500 lo pinto en el log
  if (err.status && err.status >= 500) console.error(err);
  
  // si es una petición al API respondo JSON...
  if (isAPI(req)) {
    res.json({ success: false, error: err.message });
    return;
  }

  // ...y si no respondo con HTML...

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

function isAPI(req) {
  return req.originalUrl.indexOf('/api') === 0;
}

module.exports = app;
