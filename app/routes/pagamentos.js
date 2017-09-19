module.exports = function(app) {
  app.get('/pagamentos',function(req, res) {
        res.send('ok');
  });

  app.post('/pagamentos/pagamento', function(req,res){

      req.assert("forma_pagamento", "Forma de pagamento obrigatoria").notEmpty();
      req.assert("valor","Valor obrigatorio e decimal").notEmpty().isFloat();
      req.assert("moeda", "Moeda obrigatoria").notEmpty();

      req.getValidationResult().then(function(err){
        if(!err.isEmpty()){
          console.log("arquivo de entrada apresenta erros: ");
          console.log(err.array());
          res.status(400).json(err.array());
        }
        else{
          var pagamento = req.body;
          console.log(pagamento);

          var connection = app.database.connectionFactory();
          var pagamentoDAO = new app.database.PagamentoDAO(connection);

          pagamentoDAO.salva(pagamento, function(err, result){
            if(err){
              console.log("erro ao criar pagamento:" + err);
              res.status(500).json(err);
            }
            else
            {
              console.log('pagamento criado');
              console.log(pagamento);
              res.json(pagamento);
            }
          });
        }
      });
    });
}
