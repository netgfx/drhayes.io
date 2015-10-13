'use strict';

module.exports = function (files, metalsmith, done) {
  Object.keys(files)
    .map(function (key) {
      return files[key];
    })
    .forEach(function (file) {
      if (!file.description) {
        file.description = file.firstSentence;
      }
      if (!file.description) {
        // Bail!
        file.description = 'The homepage of David Hayes.';
      }

      if (file.title && file.category) {
        // Append the category to the title for niceness.
        file.pageTitle = file.title + ' • ' + file.category;
      }

      if (!file.title) {
        file.title = 'drhayes.io • David Hayes';
      }

      if (!file.pageTitle) {
        file.pageTitle = file.title;
      }
    });
  done();
};
