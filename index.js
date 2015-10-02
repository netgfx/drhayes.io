var Metalsmith = require('metalsmith');
var watch = require('metalsmith-watch');
var markdown = require('metalsmith-markdown');
var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');
var layouts = require('metalsmith-layouts');
var Handlebars = require('handlebars');
var less = require('metalsmith-less');
var fs = require('fs');

Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.html', 'utf8'));
Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.html', 'utf8'));

Metalsmith(__dirname)
  .use(watch())
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
