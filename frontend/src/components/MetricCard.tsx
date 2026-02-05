import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value?: number
  icon: LucideIcon
  isLoading: boolean
  error?: Error | null
  lastUpdate?: number
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatLastUpdate(timestamp: number): string {
  const date = new Date(timestamp)
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}

export default function MetricCard({
  title,
  value,
  icon: Icon,
  isLoading,
  error,
  lastUpdate,
}: MetricCardProps) {
  return (
    <div className="rounded-lg border border-border bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>

      <div className="mt-3">
        {isLoading && (
          <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        )}

        {error && (
          <p className="text-sm text-red-600">
            Erro ao carregar dados
          </p>
        )}

        {!isLoading && !error && value !== undefined && (
          <>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(value)}
            </p>
            {lastUpdate && (
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                Atualizado às {formatLastUpdate(lastUpdate)}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
