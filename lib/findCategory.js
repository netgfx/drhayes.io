'use strict';

const morph = require('morph');

module.exports = function (files, metalsmith, done) {
  Object.keys(files)
    .filter(key => key.match(/\.md$/))
    .map(key => files[key])
    .forEach(file => {
      const pathBits = file.filename.split('/');
      if (pathBits.length > 1) {
        file.category = morph.toHuman(pathBits[0]);
      }
    });
  done();
};
