module.exports = function(app) {

  //lista todos os pagamentos
  app.get('/pagamentos',function(req, res) {

    var connection = app.database.connectionFactory();
    var pagamentoDAO = new app.database.PagamentoDAO(connection);

    pagamentoDAO.lista(function(err,result){
      if(err){
        console.log("erro ao listar pagamentos:" + err);
        res.status(500).json(err);
      }
      else
      {
        console.log('pagamentos:');
        console.log(result);
        res.status(200).json(result);
      }
    });
  });

  //busca um pagamento especifico
  app.get('/pagamentos/pagamento/:id',function(req, res) {

    var id = req.params.id;
    
    var connection = app.database.connectionFactory();
    var pagamentoDAO = new app.database.PagamentoDAO(connection);
    pagamentoDAO.buscaPorId(id, function(err,result){
      if(err){
        console.log("erro ao buscar pagamento " + id + ": "+ err);
        res.status(500).json(err);
      }
      else
      {
        console.log('pagamento:');
        console.log(result);
        res.status(200).json(result);
      }
    });
  });

  //cria um novo pagamento
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

              res.location('/pagamentos/pagamento/' + result.insertId);
              res.status(201).json(pagamento); // http status 201: created
            }
          });
        }
      });
    });

  //altera status do pagamento para CONFIRMADO
  app.put('/pagamentos/pagamento/:id', function(req, res){
    var pagamento = {}
    var id = req.params.id;

    pagamento.id = id;
    pagamento.status = "CONFIRMADO";

    var connection = app.database.connectionFactory();
    var pagamentoDAO = new app.database.PagamentoDAO(connection);

    pagamentoDAO.atualiza(pagamento, function(err){
      if(err){
        console.log("erro ao confirmar pagamento:" + err);
        res.status(500).json(err);
      }
      else
      {
        console.log('pagamento confirmado');
        console.log(pagamento);
        res.status(200).json(pagamento);
      }
    });
  });


  // cancelamento do pagamento
  app.delete('/pagamentos/pagamento/:id', function(req, res){
    var pagamento = {}
    var id = req.params.id;

    pagamento.id = id;
    pagamento.status = "CANCELADO";

    var connection = app.database.connectionFactory();
    var pagamentoDAO = new app.database.PagamentoDAO(connection);

    pagamentoDAO.atualiza(pagamento, function(err){
      if(err){
        console.log("erro ao cancelar pagamento:" + err);
        res.status(500).json(err);
      }
      else
      {
        console.log('pagamento cancelado');
        console.log(pagamento);
        res.status(200).json(pagamento);
      }
    });
  });
}
