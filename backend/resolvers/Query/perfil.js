const db = require('../../config/db')

module.exports = {
    async perfis(parent, args, ctx) {
        // VALIDAR SE O USUARIO É ADMIN
        ctx && ctx.validarAdmin()

        return db('perfis')
    },
    async perfil(_, { filtro }, ctx) {
        // VALIDAR SE O USUARIO É ADMIN
        ctx && ctx.validarAdmin()
        
        if(!filtro) return null
        const { id, nome } = filtro
        if(id){
            return db('perfis')
                .where({ id })
                .first();
        }else if(nome){
            return db('perfis')
                .where({ nome })
                .first();
        }else{
            return null;
        }
    }
}