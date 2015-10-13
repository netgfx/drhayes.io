'use strict';

var morph = require('morph');

module.exports = function () {
  // HACK: TOTALLY NOT GONNA WORK WITH ANY DEPTH!
  return function (files, metalsmith, done) {
    for (var filename in files) {
      var file = files[filename];
      file.filename = filename;
      if (!file.breadcrumbs) {
        file.breadcrumbs = filename.split('/').slice(0, -1).map(function (segment) {
          return {
            link: segment,
            title: morph.toTitle(segment.replace('.html', ''))
          };
        });
      }
    }
    done();
  }
};
