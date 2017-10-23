var fs = require('fs');

//lendo e escrevendo arquivos com buffer (1o le todo o arquivo e depois grava todo o arquivo)
fs.readFile('imagem.jpg', function(e1, buffer){
  console.log('arquivo lido');
  fs.writeFile('imagem2.jpg', buffer, function(e2){
    console.log('arquivo escrito');
  });
});
