//Nome do objeto que está fazendo a referência com o express
//No node modules existe uma pasta com o express.
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

//Inicializar; Precisa ter um objeto que represente o express (para manipular os recursos do express);
const api = express();
const porta = 3000;

//Quando acessar a api e definir uma rota.
const router = express.Router(); //Instanciei a classe rotas.

//Outra rota; Referecia para o modulo
const galeriaRouter = require('./router/galeriaRouter');

api.use(cors());

//tratar os objetos que forem passados por uma requisição.
//Manipular os parametros da requisição como sendo objeto javascript
api.use(bodyparser.urlencoded({extended: true}));


//Arquivos json, não pode ultrapassar 20mb
api.use(bodyparser.json({limit: '20mb', extended: true}));

//Precisamos ter rotas, uma rota que indique que a api esta online
//Função de callback dps do "/"
//request e response que sera devolvido para o cliente.
//Devolver um json com resposta
//Um obj js convertido em json;
//router.get("/", ....) -> (rota, .....);
router.get("/", (req, resp)=> resp.json({
    mensagem: 'API Online...'
}));

//Definir que a rota padrão
//Para ver se esta rodando basta rodar node api (nome deste arquivo)
//Digitar no navegador: localhost:porta ex localhost:3000

api.use("/", router);
api.use("/galeria", galeriaRouter);

//Pasta publica, externalizar a pasta public para acessar as imagens via api.
//Diretório publico
api.use('/public', express.static(__dirname + '/public'));

api.listen(porta);
console.log("Run api Express");

