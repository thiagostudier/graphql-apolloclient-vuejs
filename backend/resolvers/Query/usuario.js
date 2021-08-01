const db = require('../../config/db');
const bcrypt = require('bcrypt-nodejs');
const { getUsuarioLogado } = require('../default/usuario');

module.exports = {
    async login(_, { dados }){
        // PEGAR USUARIO
        const usuario = await db('usuarios')
            .where({ email: dados.email })
            .first();
        // SE O USUARIO NÃO EXISTIR
        if(!usuario){
            throw new Error('Usuário/Senha inválido');
        }
        // SE AS SENHAS FOREM IGUAIS
        const equals = bcrypt.compareSync(dados.senha, usuario.senha);
        if(!equals){
            throw new Error('Usuário/Senha inválido');
        }
        return getUsuarioLogado(usuario);
    },
    async usuarios(parent, args, ctx) {
        // VALIDAR SE O USUARIO É ADMIN
        ctx && ctx.validarAdmin()

        return db('usuarios')
    },
    async usuario(_, { filtro }, ctx) {
        // VALIDAR SE O USUARIO É ADMIN OU ESTÁ ACESSANDO OS SEUS PRÓPRIOS DADOS
        ctx && ctx.validarUsuarioFiltro(filtro)

        if(!filtro) return null;
        const { id, email } = filtro;
        if(id){
            return db('usuarios')
                .where({ id })
                .first();
        }else if(email){
            return db('usuarios')
                .where({ email })
                .first();
        }else{
            return null;
        }
    },
}