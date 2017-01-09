const Metalsmith = require('metalsmith');
const watch = require('metalsmith-watch');
const collections = require('metalsmith-collections');
const permalinks = require('metalsmith-permalinks');
const layouts = require('metalsmith-layouts');
const Handlebars = require('handlebars');
const less = require('metalsmith-less');
const moment = require('moment');
const fs = require('fs');

const breadcrumbs = require('./lib/breadcrumbs');
const markdown = require('./lib/markdown');
const findFirstSentence = require('./lib/findFirstSentence');
const titleAndDescription = require('./lib/titleAndDescription');
const findCategory = require('./lib/findCategory');

Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.html', 'utf8'));
Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.html', 'utf8'));
Handlebars.registerHelper('dateFormat', function (dateStr) {
  return moment(dateStr).format('MMMM D, YYYY');
});

let metalsmith = Metalsmith(__dirname);

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
  .use(findFirstSentence)
  .use(findCategory)
  .use(markdown)
  .use(titleAndDescription)
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
