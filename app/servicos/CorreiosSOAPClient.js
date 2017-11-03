var soap = require('soap');

function CorreiosSoapClient(){
  this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
}

CorreiosSoapClient.prototype.calculaPrazo = function (dados, callback) {
  soap.createClient(this._url, function(erro, cliente){
    logger.info('cliente soap criado');
    cliente.CalcPrazo(dados, callback);
  });
}

module.exports = function(){
    return CorreiosSoapClient;
};
