import { FastifyInstance } from 'fastify'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'

const FILIAIS: Record<string, string> = {
  '00': 'Petrolina',
  '01': 'Juazeiro',
  '02': 'Salgueiro',
  '05': 'Bonfim',
  '06': 'Picos',
}

export async function vendas(fastify: FastifyInstance) {
  fastify.get('/faturamento-total', async (request, reply) => {
    try {
      const result = await prisma.$queryRaw<Array<{ total: number }>>`
        SELECT 
          COALESCE(SUM(total_pedido), 0)::numeric as total
        FROM auditoria_integracao.auditoria_pedidos
        WHERE faturado = 'S'
          AND tipo_pedido = '55'
      `

      const total = result[0]?.total || 0

      return reply.send({
        total: Number(total),
        ultimaAtualizacao: new Date().toISOString(),
      })
    } catch (error) {
      fastify.log.error(error, 'Erro ao calcular faturamento total')
      return reply.code(500).send({
        error: 'Erro ao calcular faturamento total',
      })
    }
  })

  fastify.get('/faturamento-por-filial', async (request, reply) => {
    try {
      const { periodo } = request.query as { periodo?: string }
      const dateFilterVendas =
        periodo === 'day'
          ? Prisma.sql` AND data_fatura >= (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')::date`
          : periodo === 'month'
            ? Prisma.sql` AND data_fatura >= date_trunc('month', (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')::date)`
            : Prisma.empty

      const dateFilterTrocas =
        periodo === 'day'
          ? Prisma.sql` AND data_troca >= (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')::date`
          : periodo === 'month'
            ? Prisma.sql` AND data_troca >= date_trunc('month', (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')::date)`
            : Prisma.empty

      // Buscar vendas
      const vendas = await prisma.$queryRaw<Array<{ cod_filial: string; total: number; qtd_vendas: number }>>`
        SELECT 
          cod_filial,
          COALESCE(SUM(total_pedido), 0)::numeric as total,
          COUNT(DISTINCT cod_pedido)::integer as qtd_vendas
        FROM auditoria_integracao.auditoria_pedidos
        WHERE faturado = 'S'
          AND tipo_pedido = '55'
          ${dateFilterVendas}
        GROUP BY cod_filial
        ORDER BY cod_filial
      `

      // Buscar trocas/devoluções do período
      const trocas = await prisma.$queryRaw<Array<{ cod_filial: string; total_trocas: number }>>`
        SELECT 
          cod_filial,
          COALESCE(SUM(quantidade * valor), 0)::numeric as total_trocas
        FROM auditoria_integracao.auditoria_trocas
        WHERE 1=1
          ${dateFilterTrocas}
        GROUP BY cod_filial
        ORDER BY cod_filial
      `

      // Mapear trocas por filial
      const trocasMap = new Map(
        trocas.map((t: { cod_filial: string; total_trocas: number }) => [t.cod_filial, Number(t.total_trocas)])
      )

      // Calcular líquido (vendas - trocas)
      const filiais = vendas.map((row: { cod_filial: string; total: number; qtd_vendas: number }) => {
        const totalVendas = Number(row.total)
        const totalTrocas = trocasMap.get(row.cod_filial) || 0
        const totalLiquido = totalVendas - totalTrocas

        return {
          codigo: row.cod_filial,
          nome: FILIAIS[row.cod_filial] || `Filial ${row.cod_filial}`,
          total: totalLiquido,
          qtdVendas: Number(row.qtd_vendas),
        }
      })

      const totalGeral = filiais.reduce((acc: number, f: { total: number }) => acc + f.total, 0)

      return reply.send({
        filiais,
        totalGeral,
        ultimaAtualizacao: new Date().toISOString(),
      })
    } catch (error) {
      fastify.log.error(error, 'Erro ao calcular faturamento por filial')
      return reply.code(500).send({
        error: 'Erro ao calcular faturamento por filial',
      })
    }
  })

  fastify.get('/faturamento-liquido', async (request, reply) => {
    try {
      const { periodo } = request.query as { periodo?: string }
      const dateFilter =
        periodo === 'day'
          ? Prisma.sql` AND data_movimento >= (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')::date`
          : periodo === 'month'
            ? Prisma.sql` AND data_movimento >= date_trunc('month', (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')::date)`
            : Prisma.empty

      // Buscar vendas (tipo 55)
      const vendas = await prisma.$queryRaw<Array<{ cod_filial: string; total_vendas: number }>>`
        SELECT 
          cod_filial,
          COALESCE(SUM(quantidade * valor_venda), 0)::numeric as total_vendas
        FROM auditoria_integracao."Movimentacao_DRP"
        WHERE tipo_movimento = '55'
          ${dateFilter}
        GROUP BY cod_filial
        ORDER BY cod_filial
      `

      // Buscar devoluções (tipo 09)
      const devolucoes = await prisma.$queryRaw<Array<{ cod_filial: string; total_devolucoes: number }>>`
        SELECT 
          cod_filial,
          COALESCE(SUM(valor_entrada), 0)::numeric as total_devolucoes
        FROM auditoria_integracao."Movimentacao_DRP"
        WHERE tipo_movimento = '09'
          ${dateFilter}
        GROUP BY cod_filial
        ORDER BY cod_filial
      `

      // Mapear devoluções por filial
      const devolucoesMap = new Map(
        devolucoes.map((d: { cod_filial: string; total_devolucoes: number }) => [d.cod_filial, Number(d.total_devolucoes)])
      )

      // Calcular líquido (vendas - devoluções)
      const filiais = vendas.map((v: { cod_filial: string; total_vendas: number }) => {
        const totalVendas = Number(v.total_vendas)
        const totalDevolucoes = devolucoesMap.get(v.cod_filial) || 0
        const totalLiquido = totalVendas - totalDevolucoes

        return {
          codigo: v.cod_filial,
          nome: FILIAIS[v.cod_filial] || `Filial ${v.cod_filial}`,
          totalVendas,
          totalDevolucoes,
          totalLiquido,
        }
      })

      const totalGeralVendas = filiais.reduce((acc: number, f: { totalVendas: number }) => acc + f.totalVendas, 0)
      const totalGeralDevolucoes = filiais.reduce((acc: number, f: { totalDevolucoes: number }) => acc + f.totalDevolucoes, 0)
      const totalGeralLiquido = totalGeralVendas - totalGeralDevolucoes

      return reply.send({
        filiais,
        totalGeralVendas,
        totalGeralDevolucoes,
        totalGeralLiquido,
        ultimaAtualizacao: new Date().toISOString(),
      })
    } catch (error) {
      fastify.log.error(error, 'Erro ao calcular faturamento líquido')
      return reply.code(500).send({
        error: 'Erro ao calcular faturamento líquido',
      })
    }
  })
}
