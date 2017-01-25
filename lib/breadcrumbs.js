'use strict';

const morph = require('morph');

module.exports = function () {
  // HACK: TOTALLY NOT GONNA WORK WITH ANY DEPTH!
  return function (files, metalsmith, done) {
    Object.keys(files)
      .forEach(filename => {
        const file = files[filename];
        file.filename = filename;
        if (!file.breadcrumbs) {
          file.breadcrumbs = filename.split('/').slice(0, -1).map(segment => ({
              link: segment,
              title: morph.toTitle(segment.replace('.html', ''))
          }));
        }
      })
    done();
  }
};