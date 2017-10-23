module.exports = function(app) {

  app.post('/correios/prazo-entrega',function(req, res) {
    var dadosEntrega = req.body;
    console.log("calculando prazo de entrega...")
    console.log(dadosEntrega);
    var correiosSoapClient = new app.servicos.CorreiosSOAPClient();

    correiosSoapClient.calculaPrazo(dadosEntrega,
      function(erro, resultado){
        if(erro){
          res.status(500).send(erro);
          return;
        }
        console.log("prazo de entrega calculado:");
        console.log(JSON.stringify(resultado));
        res.status(200).json(resultado);
    });
  });
}
