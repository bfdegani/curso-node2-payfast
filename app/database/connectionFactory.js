var logger = require('../servicos/logger.js');
var mysql = require('mysql');
var pool;

function connectionFactory(){
  if(!pool){
    if(process.env.NODE_ENV === 'production') {
      logger.info('running in remote production database');
      pool = mysql.createPool({
        connectionLimit : 10,
        host : 'us-cdbr-iron-east-05.cleardb.net',
        user : 'ba0b8a9ddbcb56',
        password : 'e93618dd',
        database : 'heroku_a4e42e6c2ce8850'
      })
    }
    else {
      logger.info('running in development database');
      pool = mysql.createPool({
        connectionLimit : 10,
        host : 'localhost',
        user : 'bfdegani',
        password : '1234rewq',
        database : 'payfast'
      });
    }
  }
  return pool;
}

//wrapper
//dessa maneira, a conexão com o banco sera criada apenas quando o objeto for
//carregado e nao no carregamento do modulo (o que aconteceria se o conteudo
//da funcao createDBConnection estivesse dentro da funcao chamada definida em
//module.exports)
module.exports = function(){
  return connectionFactory;
}
