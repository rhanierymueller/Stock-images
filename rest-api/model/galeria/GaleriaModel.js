const db = require('../../banco/dbConexao');
//Operações basicas do CRUD.
module.exports = class GaleriaModel{
// static pode ser acessao sem precisar instaciar objetos.
    static getTodos(callback) {
        return db.query("SELECT * FROM galeria", callback);
    }
// o ? vai ser substituido pelo [id];
    static getId(id, callback) {
        return db.query("SELECT * FROM galeria WHERE id_galeria = ?", [id], callback);
    }

    // o ? vai ser substituido pelo [id];
    static adicionar(dados, callback){
        return db.query("INSERT INTO galeria (titulo, caminho) VALUES(?, ?)",
        [dados.titulo, dados.caminho], callback);
    }

    static editar(dados, callback){
        //verifica img
        if (dados.caminho != null) {
            return db.query("UPDATE galeria SET titulo = ?, caminho = ? WHERE id_galeria = ?",
            [dados.titulo, dados.caminho, dados.id_galeria], callback);
        } else {
            return db.query("UPDATE galeria SET titulo = ? WHERE id_galeria = ?",
            [dados.titulo, dados.id_galeria], callback);
        }
       
    }

    static deletar(id, callback) {
        return db.query("DELETE FROM galeria WHERE id_galeria = ?", [id], callback);
    }
}