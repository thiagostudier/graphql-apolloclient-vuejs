# Escopo e objetivo

Projeto desenvolvido no Curso "GraphQL: Criando APIs Profissionais e Flexíveis".

Vinculando o GraphQL ao VueJs com Knex com Apollo Client

## Iniciando...

- `git clone https://github.com/thiagostudier/graphql-apolloclient-vuejs`
- `cd graphql-apolloclient-vuejs`

### Backend

- `cd backend`
- `npm install`
- `npm start` - http://localhost:4000/

### Frontend

- `cd frontend`
- `npm install`
- `npm run serve` - http://localhost:8080/

#### Comando para criar projeto VueJs

- `npx vue create exemplo`

## Comandos Knex

```
npm init -y

npm i -s knex mysql

npx knex init

npx knex migrate:make tabela_perfis

npx knex migrate:latest
npx knex migrate:rollback

```

### Comandos GraphQL

Queries

```
query {
  
    usuarios{
        id nome email
        perfis {
            nome rotulo
        }
    }
    
    usuario(
        filtro: {
            id: 1
            email: ""
        }
    ){
        nome email
    }

    perfis{
        id nome rotulo
        usuarios{
            nome
            email
        }
    }
  
    perfil(
        filtro: {
            # id: 1
            nome: "admin"
        }
    ){
        nome rotulo
    }
  
}

```
Mutations

```
    novoPerfil(
        dados: {
            nome: "master"
            rotulo: "Master"
        }
    ){
        id nome rotulo
    }
  
    excluirPerfil(
        filtro: {
            # id: 7
            nome: "teste2"
        }
    ){
        id nome rotulo
    }
  
	alterarPerfil(
        filtro: {
            id: 15
            # nome: "teste2"
        }
        dados: {
            nome: "Novo Perfil 1"
        }
    ){
        id nome rotulo
	}

```

```
    novoUsuario(
        dados: {
            nome: "Leo5"
            email: "leo5@mail.com"
            senha: "123456"
            perfis: [
                { id: 1 }
                { nome: "master" }
                { nome: "aluno" }
            ]
        }
    ){
        id nome email
        perfis{
            nome
            rotulo
        }
    }
  
    excluirUsuario(
        filtro: {
            id: 6
        }
    ){
        id nome email 
    }
  
    alterarUsuario(
        filtro: {
            id: 4
            # email: "leo3@mail.com"
		}
        dados: {
            nome: "Oliver"
            # email: "oliver@mail.com"
            senha: "123456"
            perfis: [
                { id: 95 }
                { nome: "comum" }
                { nome: "admin" }
            ]
        }
    ){
        id nome email
        perfis {
            nome rotulo
        }
    }

```


