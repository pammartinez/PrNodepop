'use strict';

// middleware de comprbación de JWT

const jwt = require('jsonwebtoken');

module.exports = function () {
  return (req, res, next) => {
    // recoger el token de la petición
    const token = req.get('Authorization') || req.query.token || req.body.token;

    // si no nos dan token no pueden pasar
    if (!token) {
      const error = new Error('no token provided');
      error.status = 401;
      next(error);
      return;
    }

    // verificar que el token es válido
    jwt.verify(token, 'securetoken', (err, payload) => {
      if (err) {
        const error = new Error(err.message);
        error.status = 401;
        next(error);
        return;
      }
      req.apiAuthUserId = payload._id;
      next();
    });
  };
}