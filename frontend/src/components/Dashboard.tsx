import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import FilialCard from './FilialCard'
import FilialPeriodCard from './FilialPeriodCard'
import Layout from './Layout'

interface Filial {
  codigo: string
  nome: string
  total: number
  qtdVendas: number
}

interface FaturamentoResponse {
  filiais: Filial[]
  totalGeral: number
  ultimaAtualizacao: string
}

async function fetchFaturamentoPorFilial(): Promise<FaturamentoResponse> {
  const response = await fetch('/api/faturamento-por-filial')
  if (!response.ok) throw new Error('Erro ao buscar faturamento')
  return response.json()
}

async function fetchFaturamentoPorFilialPeriodo(periodo: 'day' | 'month'): Promise<FaturamentoResponse> {
  const response = await fetch(`/api/faturamento-por-filial?periodo=${periodo}`)
  if (!response.ok) throw new Error('Erro ao buscar faturamento por período')
  return response.json()
}

export default function Dashboard() {
  const [periodo, setPeriodo] = useState<'day' | 'month'>('month')

  const { data: dataGeral, isLoading: loadingGeral, error: errorGeral, dataUpdatedAt: updatedGeral } = useQuery({
    queryKey: ['faturamento-por-filial', 'all'],
    queryFn: fetchFaturamentoPorFilial,
  })

  const { data: dataPeriodo, isLoading: loadingPeriodo, error: errorPeriodo, dataUpdatedAt: updatedPeriodo } = useQuery({
    queryKey: ['faturamento-por-filial', periodo],
    queryFn: () => fetchFaturamentoPorFilialPeriodo(periodo),
  })

  return (
    <Layout>
      <header className="border-b border-border bg-white">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold text-foreground">
            Dashboard de Vendas
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Análise em tempo real do faturamento
          </p>
        </div>
      </header>

      <div className="px-6 py-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FilialCard
            filiais={dataGeral?.filiais || []}
            isLoading={loadingGeral}
            error={errorGeral as Error}
            lastUpdate={updatedGeral}
          />

          <FilialPeriodCard
            filiais={dataPeriodo?.filiais || []}
            isLoading={loadingPeriodo}
            error={errorPeriodo as Error}
            lastUpdate={updatedPeriodo}
            periodo={periodo}
            onChangePeriodo={setPeriodo}
          />
        </div>
      </div>
    </Layout>
  )
}
