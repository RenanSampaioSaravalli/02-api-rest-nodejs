import type { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import z from 'zod'
import { setupKnex } from '../database.js'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists.js'

// Cookies <-> Formas da gente manter contexto entre requisições (redes sociais)

export async function transactionsRoutes(app: FastifyInstance) {
  // app.addHook('preHandler', async (request, reply) => {
  //   console.log(`[${request.method}] [${request.url}]`)
  // }) // Adiciona um preHandler global para esse arquivo

  // Rota que lista transações realizadas
  app.get(
    '/',
    {
      // Prehandler é uma forma de compartilhar regras de negócio entre diferentes rotas
      // por exeemplo a função a baixo verificar se temos um sessionID e caso não exista
      // Já realiza a trativa
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const transactions = await setupKnex('transactions')
        .where('session_id', sessionId)
        .select()

      return { transactions }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionParamsSchema.parse(request.params)

      const transaction = await setupKnex('transactions')
        .where({ session_id: sessionId, id })
        .first()

      return { transaction }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const summary = await setupKnex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()
      return { summary }
    },
  )

  app.post('/', async (request, reply) => {
    // reply === Response
    /** Quando pegamos o body de dentro do request, ele vem sem tipo
     * Então meio que temos que dizer o tipo dele, Com o zod podemos fazer isso de forma
     * segura.
     */

    // Cria o schema do Corpo da requisição com o zod
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    // Faz o parse do schema com o dados que veio do body (traduz os tipos)
    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    // Trabando com cookies para armazenar a sessão e
    // identificar o usuário que realizou a transação
    let sessionId = request.cookies.sessionId

    // Pode ser que não exista uma sessão então temos que atribuir caso não exista
    if (!sessionId) {
      // atribui um id de sessão
      sessionId = randomUUID()

      // envia pelo response o id da sessão, temos que fazer umas configurações...
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      })
    }

    // Geralmente em rota de criação dentro da api, não faz retornos
    // 201 (HTTP codes) criado com sucesso
    // Insere dados na tabela 'transaction'
    await setupKnex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })
    return reply.status(201).send()
  })
}
