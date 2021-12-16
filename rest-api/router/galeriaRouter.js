var express = require('express');
var router = express.Router();

//Conexão com banco; Instanciar galeria Model
var GaleriaModel = require('../model/galeria/GaleriaModel');
var RespostaClass = require('../model/RespostaClass');

//Sistema de arquivos
var fs = require('fs');
var pastaPublica = "./public/imagens/";


//Trazer todos os registros do banco de dados

router.get("/", function(req, resp, next){
    GaleriaModel.getTodos(function(erro, retorno){
        let resposta = new RespostaClass();
 
        if(erro){
            resposta.erro = true;
            resposta.msg = "Ocorreu um erro.";
            console.log('erro:', erro);
        }else{
            resposta.dados = retorno;
        }        
        resp.json(resposta);
    });
});

router.get("/:id?", function (req, resp, next) {
    //Função de callback
    GaleriaModel.getId(req.params.id, function (erro, retorno) {
        let resposta = new RespostaClass();

        if (erro) {
            resposta.erro = true;
            resposta.msg = "Ocorreu um erro";
            console.log('erro', erro);
        } else {
            resposta.dados = retorno;
        }

        //Porem os dados estão vindo como objeto e vamos quer passar por json:
        resp.json(resposta);
    });
});


router.post("/?", function (req, resp, next) {
    let resposta = new RespostaClass();
    console.log(req.body, 'req.body');
    //Foi uma imagem realmente enviada?
    if (req.body.dados_imagem != null) {

        //salvar a dados_imagem
        let bitmap = new Buffer.from(req.body.dados_imagem.imagem_base64, 'base64');

        let dataAtual = new Date().toLocaleString().replace(/\//g, '')
            .replace(/:/g, '').replace(/-/g, '').replace(/ /g, '');

        let nomeImagemCaminho = pastaPublica + dataAtual + req.body.dados_imagem.nome_arquivo;

        //salvar de fato a imagem:
        fs.writeFileSync(nomeImagemCaminho, bitmap);

        req.body.caminho = nomeImagemCaminho;


        //Função de callback
        GaleriaModel.adicionar(req.body, function (erro, retorno) {

            if (erro) {
                resposta.erro = true;
                resposta.msg = "Ocorreu um erro";
                console.log('erro:', erro);
                console.log('erro', erro);
            } else {
                if (retorno.affectedRows > 0) {
                    resposta.msg = "Cadastro realizado com sucesso";
                } else {
                    resposta.erro = true;
                    resposta.msg = "Não foi possivel realizar a operação";
                    console.log('erro:', erro);
                }

            }
            console.log('resp:', resposta);
            //Porem os dados estão vindo como objeto e vamos quer passar por json:
            resp.json(resposta);
        });
    } else {
        resposta.erro = true;
        resposta.msg = "Não foi enviado uma imagem.";
        console.log('erro:', resposta.msg);
        resp.json(resposta);

    }

});


router.put("/", function (req, resp, next) {
    let resposta = new RespostaClass();
    if (req.body.dados_imagem != null) {
        let bitmap = new Buffer.from(req.body.dados_imagem.imagem_base64, 'base64');
        let dataAtual = new Date().toLocaleString().replace(/\//g, '').replace(/:/g, '').replace(/-/g, '').replace(/ /g, '');
        let nomeImagemCaminho = pastaPublica + dataAtual + req.body.dados_imagem.nome_arquivo;

        fs.writeFileSync(nomeImagemCaminho, bitmap);
        req.body.caminho = nomeImagemCaminho;
    }
    GaleriaModel.editar(req.body, function (erro, retorno) {
        if (erro) {
            resposta.erro = true;
            resposta.msg = "Ocorreu um erro";
            console.log('erro', erro);
        } else {
            if (retorno.affectedRows > 0) {
                resposta.msg = "Registro alterado com sucesso";
            } else {
                resposta.erro = true;
                resposta.msg = "Não foi possivel alterar o registro";
            }
        }
        console.log('resp:', resposta);
        resp.json(resposta);
    });
});

router.delete("/:id?", function (req, resp, next) {
    GaleriaModel.deletar(req.params.id, function (erro, retorno) {
        let resposta = new RespostaClass();

        if (erro) {
            resposta.erro = true;
            resposta.msg = "Ocorreu um erro";
            console.log('erro', erro);
        } else {
            if (retorno.affectedRows > 0) {
                resposta.msg = "Registro excluido com sucesso";
            } else {
                resposta.erro = true;
                resposta.msg = "Não foi possivel excluir o registro";
            }
            resposta.dados = retorno;
        }
        resp.json(resposta);
    });
});

module.exports = router;

