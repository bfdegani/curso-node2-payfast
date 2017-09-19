create table pagamentos (
  id int(11) NOT NULL AUTO_INCREMENT,
  forma_pagamento varchar(255) NOT NULL,
  valor decimal(10,2) NOT NULL,
  moeda varchar(3) NOT NULL,
  status varchar(20) DEFAULT 'CRIADO',
  data timestamp DEFAULT CURRENT_TIMESTAMP,
  descricao varchar(1024) NULL,
  PRIMARY KEY (id)
);
