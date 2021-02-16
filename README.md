desafio-type-orm-upload
Desafio RocketSeat envolvendo a utilização do TypeORM em conjunto com banco de dados Postgres

Objetivo: Finalizar a aplicação proposta contendo as seguintes rotas:

- POST /transactions: A rota deve receber title, value, type, e category dentro do corpo da requisição, sendo o type o tipo da transação, que deve ser income para entradas (depósitos) e outcome para saídas (retiradas). Ao cadastrar uma nova transação, ela deve ser armazenada dentro do seu banco de dados, possuindo os campos id, title, value, type, category_id, created_at, updated_at.

- GET /transactions: Essa rota deve retornar uma listagem com todas as transações que você cadastrou até agora, junto com o valor da soma de entradas, retiradas e total de crédito.

- DELETE /transactions/:id: A rota deve deletar uma transação com o id presente nos parâmetros da rota;

- POST /transactions/import: A rota deve permitir a importação de um arquivo com formato .csv contendo as mesmas informações necessárias para criação de uma transação id, title, value, type, category_id, created_at, updated_at, onde cada linha do arquivo CSV deve ser um novo registro para o banco de dados, e por fim retorne todas as transactions que foram importadas para seu banco de dados.

Resultado: Desafio concluido, abrangindo 6 dos 7 testes propostos.
Para o último teste necessitei de auxilio para passar e portanto deixei sua correção comentada.
Porém mesmo com esse teste não passando pude aprender os seguintes temas:
 - Manipulação de CSV com Javascript
 - Conceito de book insert
 - Diferenças no uso de .map, .foreach e . for of em loops assincronos.
 - Utilização do IndexOf


- Correções e pontos de melhoria foram adicionados ao código em formato de comentário.
