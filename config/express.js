var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var validator = require('express-validator');

module.exports = function() {
    var app = express();

    app.use(bodyParser.json());
    app.use(validator());

    consign({cwd:'app'})
      .include('routes')
      .then('database')
      .into(app);

    return app;
}
