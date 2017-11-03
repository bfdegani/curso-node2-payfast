var logger = require('../servicos/logger.js');

module.exports = function(app) {

function HATEOAS(pagamento_id){
  //enriquecendo o retorno com as operações possíveis na api após a criação do pagamento
  //Esse tipo de enriquecimento é conhecido como HATEOAS (Hypermedia as the Engine of Application State)
  var links = [
    {
      href: "/pagamentos/pagamento/" + pagamento_id,
      rel: "confirmar",
      method: "PUT"
    },
    {
      href: "/pagamentos/pagamento/" + pagamento_id,
      rel: "cancelar",
      method: "DELETE"
    },
    {
      href: "/pagamentos/pagamento/" + pagamento_id,
      rel: "buscar",
      method: "GET"
    }
  ];
  return links;
}

  //lista todos os pagamentos
  app.get('/pagamentos',function(req, res) {

    var connection = app.database.connectionFactory();
    var pagamentoDAO = new app.database.PagamentoDAO(connection);

    pagamentoDAO.lista(function(err,result){
      if(err){
        logger.info("erro ao listar pagamentos:" + err);
        res.status(500).json(err);
      }
      else
      {
        logger.info('pagamentos:');
        logger.info(result);
        if(result == '')
          res.status(404).json(result);
        else
          res.status(200).json(result);
      }
    });
  });

  //busca um pagamento especifico
  app.get('/pagamentos/pagamento/:id',function(req, res) {
    var id = req.params.id;

    var mcClient = app.servicos.MemcachedClient();

    mcClient.get('pagamento-' + id, function(erro, retorno){
      if(!erro && retorno){
        logger.info('HIT - valor: ' + JSON.stringify(retorno));
        res.status(200).json(retorno);
      }
      else {
        logger.info('MISS - chave não encontrada no cache');
        var connection = app.database.connectionFactory();
        var pagamentoDAO = new app.database.PagamentoDAO(connection);
        pagamentoDAO.buscaPorId(id, function(err,result){
          if(err){
            logger.info("erro ao buscar pagamento " + id + ": "+ err);
            res.status(500).json(err);
          }
          else
          {
            logger.info('pagamento:');
            logger.info(result);
            if(result == '')
              res.status(404).json(result);
            else {
              mcClient.set('pagamento-' + id, result, 10000, // validade do cache em ms
                            function(erro){
                              logger.info('nova chave adicionada ao cache: pagamento-' + id);
                            });
              res.status(200).json(result);
            }
          }
        });
      }
    });
  });

  //cria um novo pagamento
  app.post('/pagamentos/pagamento', function(req,res){

      // valida json de entrada
      req.assert("pagamento.forma_pagamento", "Forma de pagamento obrigatoria").notEmpty();
      req.assert("pagamento.valor","Valor obrigatorio e decimal").notEmpty().isFloat();
      req.assert("pagamento.moeda", "Moeda obrigatoria").notEmpty();

      req.getValidationResult().then(function(err){
        if(!err.isEmpty()){
          logger.info("arquivo de entrada apresenta erros: ");
          logger.info(err.array());
          res.status(400).json(err.array());
          return;
        }

        var pagamento = req.body.pagamento;
        pagamento.status = 'CRIADO';

        var infoResponse = {};
        //logger.info(pagamento);

        //se for pagamento via cartao, autoriza
        if(pagamento.forma_pagamento == 'cartao'){
          var cartao = req.body.cartao;
          infoResponse.dados_cartao = cartao;

          var clienteCartoes = new app.servicos.ClienteCartoes();
          clienteCartoes.autoriza(cartao, function(erros, request, response, retorno){
            if(erros){
              logger.info(erros);
              res.status(400).send(erros);
              return;
            }
          });
          pagamento.status = 'AUTORIZADO';
        }

        //cria registro do pagamento
        var connection = app.database.connectionFactory();
        var pagamentoDAO = new app.database.PagamentoDAO(connection);

        pagamentoDAO.salva(pagamento, function(err, result){
          if(err){
            logger.info("erro ao criar pagamento:" + err);
            res.status(500).json(err);
            return;
          }

          logger.info('pagamento criado');
          //logger.info(pagamento);
          pagamento.id = result.insertId;

          res.location('/pagamentos/pagamento/' + pagamento.id);
          infoResponse.dados_pagamento = pagamento;
          infoResponse.links = HATEOAS(pagamento.id);

          res.status(201).json(infoResponse); // http status 201: created
        });
      });
    });

      //altera status do pagamento para CONFIRMADO
      app.put('/pagamentos/pagamento/:id', function(req, res){
        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = "CONFIRMADO";

        var connection = app.database.connectionFactory();
        var pagamentoDAO = new app.database.PagamentoDAO(connection);

        pagamentoDAO.atualiza(pagamento, function(err){
          if(err){
            logger.info("erro ao confirmar pagamento:" + err);
            res.status(500).json(err);
          }
          else
          {
            logger.info('pagamento confirmado');
            logger.info(pagamento);

            //caso a informação do pagamento existe no cache, exclui para que não haja inconsistencia
            var mcClient = app.servicos.MemcachedClient();
            mcClient.del('pagamento-' + id, function(erro, retorno){
              if(retorno)
                logger.info('pagamento-' + id + ' removido do cache');
              else
                logger.info('pagamento-' + id + ' não encontrado no cache');
            });

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
        logger.info("erro ao cancelar pagamento:" + err);
        res.status(500).json(err);
      }
      else
      {
        logger.info('pagamento cancelado');
        logger.info(pagamento);

        //caso a informação do pagamento existe no cache, exclui para que não haja inconsistencia
        var mcClient = app.servicos.MemcachedClient();
        mcClient.del('pagamento-' + id, function(erro, retorno){
          if(retorno)
            logger.info('pagamento-' + id + ' removido do cache');
          else
            logger.info('pagamento-' + id + ' não encontrado no cache');
        });

        res.status(200).json(pagamento);
      }
    });
  });

}
