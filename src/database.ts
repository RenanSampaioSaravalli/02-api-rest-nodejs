import knex from 'knex'
import type { Knex } from 'knex'
import { env } from './env/index.js'

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const setupKnex = knex(config)

/**
 * A Partir que uma migration criada foi enviada para produção
 * eu não posso mais editar essa migration
 */
