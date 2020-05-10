'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');

class LoginController {

  /**
   * POST /api/authenticate
   */
  async postJWT(req, res, next) {
    try {
      
      // recoger los parámetros de entrada
      const email = req.body.email;
      const password = req.body.password;
      
      // buscar el usuario en la base de datos
      const usuario = await Usuario.findOne({ email: email });
      
      // si no existe el usuario o la password no coincide
      if (!usuario || !await bcrypt.compare(password, usuario.password)) {
        const error = new Error('invalid credentials');
        error.status = 401;
        next(error);
        return;
      }

      // encuentro el usuario y la password es correcta

      // crear un JWT
      const token = jwt.sign({ _id: usuario._id }, 'securetoken', {
        expiresIn: '2d'
      });

      // responder
      res.json({ token: token });

    } catch (err) {
      next(err);
    }
  }

}

module.exports = new LoginController();