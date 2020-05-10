'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');
const cote = require('cote');
const requester = new cote.Requester({ name: 'thumbnails' });

router.get('/', (req, res, next) => {

  const start = parseInt(req.query.start) || 0;
  const limit = parseInt(req.query.limit) || 1000; // nuestro api devuelve max 1000 registros
  const sort = req.query.sort || '_id';
  const includeTotal = req.query.includeTotal === 'true';
  const filters = {};
  if (typeof req.query.tag !== 'undefined') {
    filters.tags = req.query.tag;
  }

  if (typeof req.query.venta !== 'undefined') {
    filters.venta = req.query.venta;
  }

  if (typeof req.query.precio !== 'undefined' && req.query.precio !== '-') {
    if (req.query.precio.indexOf('-') !== -1) {
      filters.precio = {};
      let rango = req.query.precio.split('-');
      if (rango[0] !== '') {
        filters.precio.$gte = rango[0];
      }

      if (rango[1] !== '') {
        filters.precio.$lte = rango[1];
      }
    } else {
      filters.precio = req.query.precio;
    }
  }

  if (typeof req.query.nombre !== 'undefined') {
    filters.nombre = new RegExp('^' + req.query.nombre, 'i');
  }

  Anuncio.list(filters, start, limit, sort, includeTotal, function (err, anuncios) {
    if (err) return next(err);
    res.json({ ok: true, result: anuncios });
  });
});

// Return the list of available tags
router.get('/tags', function (req, res) {
  res.json({ ok: true, allowedTags: Anuncio.allowedTags() });
});

// Ruta para crear aunucio
router.post('/', function (req, res) {

  // Recupera los datos del anuncio
  const nombre = req.body.nombre
  const venta = req.body.venta || false
  const precio = req.body.precio || 0
  const foto = req.file.filename
  const tags = req.body.tags || []

  // llama al servicio de thumbnails con la direccion del archivo
  requester.send({ type: 'crear thumbnails', file: req.file.path })

  // crea el anuncio en la Base de datos
  Anuncio.create({ nombre, venta, precio, foto, tags }, (err, result) => {
    if (err) return next(err);
    res.json({ ok: true, result: result });
  })
  
});

module.exports = router;
