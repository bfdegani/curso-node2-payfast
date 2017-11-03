var logger = require('../servicos/logger.js');
var fs = require('fs');

module.exports = function(app){

  app.post('/upload/imagem', function(req, res){
    logger.info('recebendo imagem...');

    var filename = req.headers.filename;
    req.pipe(fs.createWriteStream('files/' + filename))
      .on('finish', function(){
        logger.info('OK');
        res.status(201).send('OK');
      });

  });
}
