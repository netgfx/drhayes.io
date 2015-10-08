'use strict';

var prism = require('prismjs');
var marked = require('marked');
var markdown = require('metalsmith-markdown');

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

module.exports = markdown(markdownOptions);
