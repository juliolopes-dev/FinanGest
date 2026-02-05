import { Building2 } from 'lucide-react'

interface Filial {
  codigo: string
  nome: string
  total: number
  qtdVendas: number
}

interface FilialCardProps {
  filiais: Filial[]
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

export default function FilialCard({
  filiais,
  isLoading,
  error,
  lastUpdate,
}: FilialCardProps) {
  return (
    <div className="w-full max-w-[280px] rounded-lg border border-border bg-white p-2 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-1.5">
        <h3 className="text-xs font-semibold text-foreground">Faturamento por Filial</h3>
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
          <Building2 className="h-3 w-3 text-primary" />
        </div>
      </div>

      <div className="mt-1.5">
        {isLoading && (
          <div className="space-y-2">
            <div className="h-6 w-full animate-pulse rounded bg-muted" />
            <div className="h-6 w-full animate-pulse rounded bg-muted" />
            <div className="h-6 w-full animate-pulse rounded bg-muted" />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600">
            Erro ao carregar dados
          </p>
        )}

        {!isLoading && !error && filiais && (
          <>
            <div className="space-y-1">
              {filiais.map((filial) => (
                <div
                  key={filial.codigo}
                  className="flex items-center justify-between rounded bg-muted/50 px-2 py-1 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-foreground">
                      {filial.nome}
                    </span>
                    <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                      {filial.qtdVendas}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {formatCurrency(filial.total)}
                  </span>
                </div>
              ))}
            </div>

            {lastUpdate && (
              <p className="mt-1.5 text-[9px] text-muted-foreground">
                Atualizado às {formatLastUpdate(lastUpdate)}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
