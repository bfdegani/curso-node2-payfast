var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var morgan = require('morgan');
var logger = require('../app/servicos/logger.js');

module.exports = function() {
    var app = express();

    //usando morgan para interceptar requisicoes e registrar no log
    app.use(morgan("combined", { // formatos: common, combined, dev, short, tiny
      stream: {
        write: function(mensagem){
          logger.info(mensagem);
        }
      }
    }));

    app.use(bodyParser.json());
    app.use(validator());

    consign({cwd:'app'})
      .include('servicos')
      .then('routes')
      .then('database')
      .into(app);

    return app;
}
