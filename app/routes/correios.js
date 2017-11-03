var logger = require('../servicos/logger.js');
module.exports = function(app) {

  app.post('/correios/prazo-entrega',function(req, res) {
    var dadosEntrega = req.body;
    logger.info("calculando prazo de entrega...")
    logger.info(dadosEntrega);
    var correiosSoapClient = new app.servicos.CorreiosSOAPClient();

    correiosSoapClient.calculaPrazo(dadosEntrega,
      function(erro, resultado){
        if(erro){
          res.status(500).send(erro);
          return;
        }
        logger.info("prazo de entrega calculado:");
        logger.info(JSON.stringify(resultado));
        res.status(200).json(resultado);
    });
  });
}
