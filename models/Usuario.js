'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');

const usuarioSchema = mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
});

usuarioSchema.statics.hashPassword = function (plainPassword) {
  return bcrypt.hashSync(plainPassword, 10);
}

/**
 * carga un json de usuarios
 */
usuarioSchema.statics.cargaJson = async function (fichero) {

  // Using a callback function with async/await
  const data = await new Promise((resolve, reject) => {
    fs.readFile(fichero, { encoding: 'utf8' }, (err, data) => {
      return err ? reject(err) : resolve(data);
    });
  });

  console.log(fichero + ' leido.');

  if (!data) {
    throw new Error(fichero + ' está vacio!');
  }

  const usuarios = JSON.parse(data).usuarios;
  const numUsuarios = usuarios.length;

  for (var i = 0; i < usuarios.length; i++) {
    var nuevoUsuario = {
      password: Usuario.hashPassword(usuarios[i].password),
      email: usuarios[i].email
    }
    await (new Usuario(nuevoUsuario)).save();
  }

  return numUsuarios;

};

var Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;