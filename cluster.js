var cluster = require('cluster');
var os = require('os');

var cpus = os.cpus();

if(cluster.isMaster){
  console.log('executando thread master');
  console.log(cpus);
  cpus.forEach(function(){
    cluster.fork();
  })

  //monitora execução da thread
  cluster.on('listening', function(worker){
    console.log('cluster conectado ' + worker.process.pid);
  });

  //monitora encerramento da thread
  cluster.on('exit', worker => { //outra forma de representar uma função de callback (usando 'lambda')
    console.log('cluster %d encerrado', worker.process.pid);
    cluster.fork(); //inicia nova thread
  })
}
else{
  console.log('executando thread slave');
  require('./index.js');
  //cluster.fork(); //esse comando causaria erro de execução por não ser possivel fazer fork de thread slave
}
