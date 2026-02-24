import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions.js'
import cookie from '@fastify/cookie'

export const app = fastify()

// Ordem que registramos nossos plugins é a ordem
// que o fastify vai executar
app.register(cookie)
// Registra o 'plugin' no nosso servidor (registra a rota)
// Quando registramos um plugin podemos adicionar um prefixo da rota
app.register(transactionsRoutes, { prefix: 'transactions' })
