import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'
import { prisma } from './lib/prisma.js'
import { vendas } from './routes/vendas.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const fastify = Fastify({
  logger: process.env.NODE_ENV === 'development',
})

await fastify.register(cors, {
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
})

fastify.register(vendas, { prefix: '/api' })

if (process.env.NODE_ENV === 'production') {
  const frontendPath = join(__dirname, '../../frontend/dist')
  await fastify.register(fastifyStatic, {
    root: frontendPath,
    prefix: '/',
  })

  fastify.setNotFoundHandler((request, reply) => {
    if (!request.url.startsWith('/api')) {
      reply.sendFile('index.html')
    } else {
      reply.code(404).send({ error: 'Not Found' })
    }
  })
}

const start = async () => {
  try {
    await prisma.$connect()
    fastify.log.info('✅ Conectado ao banco de dados PostgreSQL')

    const port = Number(process.env.PORT) || 3000
    await fastify.listen({ port, host: '0.0.0.0' })
    
    fastify.log.info(`🚀 Servidor rodando em http://localhost:${port}`)
  } catch (err) {
    fastify.log.error(err)
    await prisma.$disconnect()
    process.exit(1)
  }
}

start()
