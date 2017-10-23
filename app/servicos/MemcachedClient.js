var memcached = require('memcached');

var clienteMC = new memcached('localhost:11211', {
  retries: 10, //retentativas por request no cache
  retry: 10000, //tempo em ms entre 2 retries no mesmo nó do cluster de cache
  remove: true //remove do cluster nós que não estejam funcionando
});

clienteMC.set('pagamento-60', {'id':60}, 60000 /* validade do cache em ms */, function(erro){
  console.log('nova chave adicionada ao cache: pagamento-60');
});

clienteMC.get('pagamento-60', function(erro, retorno){
  if(erro || !retorno){
    console.log('MISS - chave não encontrada no cache');
  } else {
    console.log('HIT - valor: ' + JSON.stringify(retorno));
  }
});
