const db = require('../../config/db')

const { perfil: obterPerfil } = require('../Query/perfil'); //IMPORTANDO FUNÇÃO DE PEGAR PERFIL

module.exports = {
    async novoPerfil(_, { dados }, ctx) {
        // VALIDAR SE O USUARIO É ADMIN
        ctx && ctx.validarAdmin()

        try {
            const [ id ] = await db('perfis').insert(dados);
            return db('perfis')
                .where({ id })
                .first();
        } catch(e) {
            throw new Error(e.sqlMessage)
        }
    },
    async excluirPerfil(_, { filtro }, ctx) {
        // VALIDAR SE O USUARIO É ADMIN
        ctx && ctx.validarAdmin()

        try {
            const perfil = await obterPerfil(_, { filtro }); //PEGAR PERFIL PELA FUNÇÃO IMPORTADA
            if(perfil) {
                const { id } = perfil //PEGAR ID DO PERFIL
                // PEGAR OS DADOS DE USUARIOS_PERFIS VINCULADOS AO PERFIL E APAGAR
                await db('usuarios_perfis')
                    .where({ perfil_id: id })
                    .delete()
                // APAGAR O PERFIL
                await db('perfis')
                    .where({ id })
                    .delete();
            }
            return perfil;
        } catch(e) {
            throw new Error(e.sqlMessage)
        }
    },
    async alterarPerfil(_, { filtro, dados }, ctx) {
        // VALIDAR SE O USUARIO É ADMIN
        ctx && ctx.validarAdmin()
        
        try {
            const perfil = await obterPerfil(_, { filtro }); //PEGAR PERFIL PELA FUNÇÃO IMPORTADA
            if(perfil) {
                const { id } = perfil //PEGAR ID DO PERFIL
                // ATUALIZAR PERFIL
                await db('perfis')
                    .where({ id })
                    .update(dados);
            }
            return { ...perfil, ...dados};
        } catch(e) {
            throw new Error(e.sqlMessage)
        }
    }
}