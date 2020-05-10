'use strict';

// Servicio de ajuste de thumbnails

const cote = require('cote');
const jimp = require('jimp');
const path = require('path');

// declarar el microservicio
const responder = new cote.Responder({ name: 'thumbnails' });

// logica del servicio
responder.on('crear thumbnails', async function (req, done) {
  try {

    // Read the image.
    const imagePath = path.join(__dirname, '..', req.file)
    const image = await jimp.read(imagePath);

    // Resize the image to width 150 and auto height.
    await image.resize(100, 100);

    // Save and overwrite the image
    await image.writeAsync(imagePath);

    done();

  } catch (err) {
    done(err);
  }
});