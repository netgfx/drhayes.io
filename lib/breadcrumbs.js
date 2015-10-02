'use strict';

module.exports = function () {
  // HACK: TOTALLY NOT GONNA WORK WITH ANY DEPTH!
  function (files, metalsmith, done) {
    for (var filename in files) {
      var file = files[filename];
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
