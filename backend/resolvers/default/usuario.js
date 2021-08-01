const jwt = require('jwt-simple');
const { perfis: obterPerfis } = require('../Type/Usuario');

module.exports = {
    async getUsuarioLogado(usuario) {
        const perfis = await obterPerfis(usuario) // PEGAR PERFIS DO USUARIO
        const now = Math.floor(Date.now() / 1000) //PEGAR HORA AGORA

        const usuarioInfo = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            perfis: perfis.map(p => p.nome), //PEGAR APENAS OS NOMES
            iat: now,
            exp: now + ( 3 * 24 * 60 * 60 ) // EXPIRAÇÃO: AGORA + 3 DIAS
        }

        const authSecret = process.env.APP_AUTH_SECRET;
        return {
            ...usuarioInfo,
            token: jwt.encode(usuarioInfo, authSecret) // CRIAR TOKEN A PARTIR DO APP_AUTH_SECRET
        }

    }
}