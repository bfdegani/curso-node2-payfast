var restifyClients = require('restify-clients');
var cliente = restifyClients.createJsonClient({ url: 'http://localhost:3001' });

function ClienteCartoes(){}

ClienteCartoes.prototype.autoriza = function (cartao) {
  cliente.post('/cartoes/autoriza', cartao, function(err, req, res, ret){
    console.log('consumindo servico de autorizacao de cartao');
    console.log(ret);
  });
}

module.exports = function(){
    return ClienteCartoes;
};
