var memcached = require('memcached');

module.exports = function(){
  return createMencachedClient;
}

function createMencachedClient(){
  var clienteMC = new memcached('localhost:11211', {
    retries: 10, //retentativas por request no cache
    retry: 10000, //tempo em ms entre 2 retries no mesmo nó do cluster de cache
    remove: true //remove do cluster nós que não estejam funcionando
  });
  return clienteMC;
}
