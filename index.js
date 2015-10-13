var Metalsmith = require('metalsmith');
var watch = require('metalsmith-watch');
var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');
var layouts = require('metalsmith-layouts');
var Handlebars = require('handlebars');
var less = require('metalsmith-less');
var moment = require('moment');
var fs = require('fs');

var breadcrumbs = require('./lib/breadcrumbs');
var markdown = require('./lib/markdown');
var generateDescription = require('./lib/generateDescription');

Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.html', 'utf8'));
Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.html', 'utf8'));
Handlebars.registerHelper('dateFormat', function (dateStr) {
  return moment(dateStr).format('MMMM D, YYYY');
});

var metalsmith = Metalsmith(__dirname);

if (process.env.WATCH === 'true') {
  metalsmith = metalsmith
    .use(watch({
      paths: {
        "${source}/**/*": true,
        "templates/**/*": "**/*.md"
      }
    }));
}

metalsmith
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
  .use(breadcrumbs())
  .use(generateDescription)
  .use(markdown)
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
  .destination('./build')
  .build(function(err, files) {
    if (err) {
      throw err;
    }
  });
