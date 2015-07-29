'use strict';

var path = require('path');
var Metalsmith = require('metalsmith');
var ignore = require('metalsmith-ignore');
var layouts = require('metalsmith-layouts');
var markdown = require('metalsmith-markdown');
var permalinks = require('metalsmith-permalinks');
var postcss = require('metalsmith-postcss');
var templates = require('metalsmith-templates');

new Metalsmith(path.resolve(__dirname, '..'))
  .use(markdown())
  .use(templates('handlebars'))
  .build(function(err) {
    if (err) {
      throw err;
    }
  });

/*
"postcss-nested": "^0.3.2",
"postcss-simple-vars": "^0.3.0"
*/
