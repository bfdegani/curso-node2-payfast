var fs = require('fs');

//leitura e escrita de arquivos com streaming (leitura e escrita acontecem em paralelo)
//1GB é o limite de memória gerenciada pela V8 (engine do node) por isso existe a necessidade de manipular arquivos como stream
fs.createReadStream('imagem.jpg')
  .pipe(fs.createWriteStream('imagem3.jpg')) //encadeia uma nova chamada de função no fluxo de execução do node
  .on('finish', function(){ //estabelece um listener para identificar o fim da execução dos 2 fluxos (leitura e escrita)
    console.log('processamento de streaming concluido');
  });
