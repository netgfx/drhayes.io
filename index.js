var Metalsmith = require('metalsmith');
var watch = require('metalsmith-watch');
var markdown = require('metalsmith-markdown');
var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');
var layouts = require('metalsmith-layouts');
var Handlebars = require('handlebars');
var less = require('metalsmith-less');
var moment = require('moment');
var morph = require('morph');
var fs = require('fs');

Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.html', 'utf8'));
Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.html', 'utf8'));
Handlebars.registerHelper('dateFormat', function (dateStr) {
  return moment(dateStr).format('MMMM D, YYYY');
})

Metalsmith(__dirname)
  .use(watch({
    paths: {
      "${source}/**/*": true,
      "templates/**/*": "**/*.md"
    }
  }))
  .use(collections({
    pages: {
      pattern: 'content/pages/*.md'
    },
    posts: {
      pattern: 'content/posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  // HACK: TOTALLY NOT GONNA WORK WITH ANY DEPTH!
  .use(function (files, metalsmith, done) {
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
  })
  .use(markdown())
  .use(layouts({
    engine: 'handlebars',
    directory: 'templates',
    partials: 'templates/partials',
    default: 'page.html',
    pattern: '**/*.html'
  }))
  .use(less({
    pattern: 'less/style.less',
    render: {
      paths: [
        'src/less/'
      ]
    }
  }))
  // .use(permalinks({
  //   pattern: ':collection/:title'
  // }))
  // .use(function(files, metalsmith, done) {
  //   for (var filename in files) {
  //     if (filename.match())
  //     console.log(filename);
  //   }
  //   done();
  // })
  .destination('./build')
  .build(function(err, files) {
    if (err) {
      throw err;
    }
  });
