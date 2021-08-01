const bcrypt = require('bcrypt-nodejs');

const db = require('../../config/db')

const { perfil: obterPerfil } = require('../Query/perfil'); //IMPORTANDO FUNÇÃO DE PEGAR PERFIL
const { usuario: obterUsuario } = require('../Query/usuario'); //IMPORTANDO FUNÇÃO DE PEGAR PERFIL

const mutations = {
    async registrarUsuario(_, { dados }){
        // REUTILIZANDO O CÓDIGO DE NOVO USUARIO
        return mutations.novoUsuario(_, {
            dados: {
                nome: dados.nome,
                email: dados.email,
                senha: dados.senha
            }
        })
    },
    async novoUsuario(_, { dados }, ctx) {
        // VALIDAR SE O USUARIO É ADMIN
        ctx && ctx.validarAdmin()

        try {
            const idsPerfis = [] //CRIAR ARRAY VAZIO 

            // SE NÃO HOUVER PERFIS
            if(!dados.perfis || !dados.perfis.length){
                dados.perfis = [{
                    nome: 'comum'
                }]
            }
            //PERCORRER PERFIS
            for(let filtro of dados.perfis){
                const perfil = await obterPerfil(_, {filtro}) //PEGAR PERFIL PELA FUNÇÃO IMPORTADA
                if(perfil) idsPerfis.push(perfil.id) //SE HOUVER O PERFIL, ADICIONAR O ID NO ARRAY
            }

            // CRIPTOGRAFAR SENHA
            const salt = bcrypt.genSaltSync()
            dados.senha = bcrypt.hashSync(dados.senha, salt);

            // REMOVER OS DADOS DOS PERFIS ADICIONADOS NO "dados"
            delete dados.perfis;
            // CRIAR USUÁRIO
            const [ id ] = await db('usuarios')
                .insert({...dados});
            // CRIAR OS RELACIONAMENTOS ENTRE O USUARIOS E O(S) PERFIL(S)
            for(let perfil_id of idsPerfis){
                await db('usuarios_perfis')
                    .insert({ perfil_id, usuario_id: id });
            }
            // RETORNAR O USUARIO CRIADO
            // return obterUsuario(_, {filtro: {id: id}});
            return db('usuarios')
                .where({ id })
                .first();
        } catch(e) {
            throw new Error(e.sqlMessage)
        }
    },
    async excluirUsuario(_, { filtro }, ctx) {
        // VALIDAR SE O USUARIO É ADMIN
        ctx && ctx.validarAdmin()

        try {
            const usuario = await obterUsuario(_, {filtro}); //PEGAR USUARIO PELA FUNÇÃO IMPORTADA
            if(usuario){ 
                //PEGAR ID
                const { id } = usuario;
                // APAGR OS RELACIONAMENTOS ENTRE OS USUARIOS E OS PERFILS DESTE USUARIO
                await db('usuarios_perfis')
                    .where({ usuario_id: id })
                    .delete();
                // APAGAR USUARIO
                await db('usuarios')
                    .where({ id })
                    .delete();
            }
            return usuario;
        } catch(e) {
            throw new Error(e.sqlMessage)
        }
    },
    async alterarUsuario(_, { filtro, dados }, ctx) {
        // VALIDAR SE O USUARIO É ADMIN
        ctx && ctx.validarUsuarioFiltro(filtro)

        try {
            const usuario = await obterUsuario(_, {filtro}); //PEGAR USUARIO PELA FUNÇÃO IMPORTADA
            if(usuario){ 
                const { id } = usuario
                // SE HOUVEREM PERFIS PARA EDITAR
                if(ctx.admin && dados.perfis){
                    // APAGAR TODOS OS RELACIONAMENTOS ENTRE OS PERFIS
                    await db('usuarios_perfis')
                        .where( {usuario_id: id} )
                        .delete()
                    // PERCORRER PERFIS ADICIONADOS
                    for(let filtro of dados.perfis){
                        // PEGAR PERFIL 
                        const perfil = await obterPerfil(_, {filtro});
                        // CRIAR RELACIONAMENTO SE O PERFIL EXISTIR
                        perfil && await db('usuarios_perfis')
                            .insert({ 
                                perfil_id: perfil.id, 
                                usuario_id: id 
                            });
                    }
                }
                // SE A SENHA FOR SETADA
                if(dados.senha){
                    // CRIPTOGRAFAR SENHA
                    const salt = bcrypt.genSaltSync()
                    dados.senha = bcrypt.hashSync(dados.senha, salt);
                }
                // REMOVER OS DADOS DOS PERFIS ADICIONADOS NO "dados"
                delete dados.perfis;
                // ATUALIZAR DADOS
                await db('usuarios')
                    .where({ id })
                    .update(dados);
            }
            // RETORNAR DADOS ATUALIZADOS OU VALOR NULO 
            return !usuario ? null : { ...usuario, ...dados }
        } catch(e) {
            throw new Error(e)
        }
    }
}

module.exports = mutations;