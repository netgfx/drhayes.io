var Metalsmith = require('metalsmith');
var watch = require('metalsmith-watch');
var markdown = require('metalsmith-markdown');
var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');
var layouts = require('metalsmith-layouts');
var Handlebars = require('handlebars');
var less = require('metalsmith-less');
var moment = require('moment');
var prism = require('prismjs');
var marked = require('marked');
var fs = require('fs');

var breadcrumbs = require('./lib/breadcrumbs');

Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.html', 'utf8'));
Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.html', 'utf8'));
Handlebars.registerHelper('dateFormat', function (dateStr) {
  return moment(dateStr).format('MMMM D, YYYY');
});

// via https://glen.codes/using-prism-with-metalsmith-and-markdown/
// Translate marked languages to prism.
var extensions = {
  js: 'javascript',
  scss: 'css',
  sass: 'css',
  html: 'markup',
  svg: 'markup',
  xml: 'markup',
  py: 'python',
  rb: 'ruby',
  ps1: 'powershell',
  psm1: 'powershell'
};

var markdownOptions = {
  highlight: function(code, lang) {
    if (!prism.languages.hasOwnProperty(lang)) {
      // Default to markup if it's not in our extensions.
      lang = extensions[lang] || 'javascript';
    }

    return prism.highlight(code, prism.languages[lang]);
  }
};

var renderer = new marked.Renderer();

// Change the code method to output the same as Prism.js would.
renderer.code = function(code, lang, escaped) {
  code = this.options.highlight(code, lang);

  if (!lang) {
    return '<pre><code>' + code + '</code></pre>';
  }

  // e.g. "language-js"
  var langClass = this.options.langPrefix + lang;

  return '<pre class="' + langClass + '"><code class="' + langClass + '">' +
    code +
    '</code></pre>';
};

var markdownOptions = {
  gfm: true,
  smartypants: true,
  renderer: renderer,
  langPrefix: 'language-',
  highlight: function(code, lang) {
    if (!prism.languages.hasOwnProperty(lang)) {
      // Default to markup.
      lang = extensions[lang] || 'markup';
    }
    return prism.highlight(code, prism.languages[lang]);
  }
};

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
  .use(breadcrumbs())
  .use(markdown(markdownOptions))
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
