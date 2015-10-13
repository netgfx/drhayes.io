'use strict';

module.exports = function (files, metalsmith, done) {
  Object.keys(files)
    .filter(function (key) {
      return key.match(/\.md$/);
    })
    .map(function (key) {
      return files[key];
    })
    .forEach(function (file) {
      var contents = file.contents.toString();
      var match = contents.match(/.+/);
      if (match) {
        file.firstSentence = match[0]
          // Kill reference links.
          .replace(/\[([^\]]*)\]\[.*\]/gi, '$1')
          // Kill inline links.
          .replace(/\[([^\]]*)\]\(.*\)/gi, '$1');
      }
    });
  done();
};
