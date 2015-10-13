'use strict';

var morph = require('morph');

module.exports = function (files, metalsmith, done) {
  Object.keys(files)
    .filter(function (key) {
      return key.match(/\.md$/);
    })
    .map(function (key) {
      return files[key];
    })
    .forEach(function (file) {
      var pathBits = file.filename.split('/');
      if (pathBits.length > 1) {
        file.category = morph.toHuman(pathBits[0]);
      }
    });
  done();
};
