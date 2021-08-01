const jwt = require('jwt-simple')

module.exports = async ({ req }) => {
    // EM DESENVOLVIMENTO - GERAR TOKEN
    // await require('./simularUsuarioLogado')(req)

    const auth = req.headers.authorization
    const token = auth && auth.substring(7)

    let usuario = null
    let admin = false

    if(token){
        try {
            let conteudoToken = jwt.decode(token, process.env.APP_AUTH_SECRET)
            // SE E O TOKEN EXPIROU
            if(new Date(conteudoToken.exp * 1000) > new Date()){
                usuario = conteudoToken
            }
        }catch(e){
            // TOKEN INVÁLIDO

        }
    }
    // SE O USUARIO POSSUIR UM PERFIL DE ADMIN
    if(usuario && usuario.perfis){
        admin = usuario.perfis.includes('admin')
    }

    console.log(usuario);
    
    // MENSAGEM DE ERROR
    const err = new Error('Acesso negado!');

    return {
        usuario,
        admin,
        validarUsuario(){
            if(!usuario) throw err
        },
        validarAdmin(){
            if(!admin) throw err
        },
        validarUsuarioFiltro(filtro){

            if(admin) return //SE FOR ADMIN, LIBERAR
            if(!usuario) throw err //ERRO SE O USUARIO NÃO EXISTIR
            if(!filtro) throw err //ERRO SE NÃO HOUVER FILTRO

            const { id, email } = filtro

            if(!id && !email) throw err //ERRO SE NÃO HOUVER ID E EMAIL
            if(id && id !== usuario.id) throw err //ERRO SE ID FOR DIFERENTE
            if(email && email !== usuario.email) throw err //ERRO SE EMAIL FOR DIFERENTE

        }
    }

}