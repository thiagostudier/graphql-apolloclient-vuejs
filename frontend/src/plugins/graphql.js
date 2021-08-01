import Vue from 'vue'
// BIBLIOTECAS APOLLO CLIENT - PARA CRIAR VARIÁVEIS GLOBAIS
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

Vue.use({
    install(Vue) {
        // APOLLOLINK
        const httpLink = createHttpLink({
            uri: 'http://localhost:4000/'
        })
        
        // APOLLOLINK
        const authLink = setContext((_, { headers }) => {
            const token = localStorage.getItem('token')
            return {
                headers: {
                    ...headers,
                    authorization: token ? `Bearer ${token}` : ''
                }
            }
        })      
        
        Vue.prototype.$api = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache()
        })

    }
})