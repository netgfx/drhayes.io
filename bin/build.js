'use strict';

var path = require('path');
var Metalsmith = require('metalsmith');
var ignore = require('metalsmith-ignore');
var layouts = require('metalsmith-layouts');
var less = require('metalsmith-less');
var markdown = require('metalsmith-markdown');
var permalinks = require('metalsmith-permalinks');
var postcss = require('metalsmith-postcss');

new Metalsmith(path.resolve(__dirname, '..'))
  .ignore('_*')
  .use(markdown())
  .use(layouts({
    engine: 'handlebars',
    default: 'layout.html'
  }))
  .use(less({
    pattern: 'css/style.less',
    render: {
      paths: ['./src/css/']
    }
  }))
  .build(function(err) {
    if (err) {
      console.error(err);
      throw err;
    }
  });

/*
"postcss-nested": "^0.3.2",
"postcss-simple-vars": "^0.3.0"
*/
