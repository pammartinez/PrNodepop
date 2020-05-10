'use strict';

const i18n = require('i18n');
const path = require('path');

module.exports = function () {
  i18n.configure({
    locales: ['en', 'es'],
    directory: path.join(__dirname, '..', 'locales'),
    defaultLocale: 'es',
    autoReload: true, // recargar ficheros de idioma si cambian
    syncFiles: true, // crear literales en todos los locales automáticamente en desarrollo
    cookie: 'nodeapi-locale'
  });

  return i18n;
};
