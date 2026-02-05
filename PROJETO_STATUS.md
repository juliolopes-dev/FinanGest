# Status do Projeto - FinanGest Dashboard

## 1. Visão Geral
- **Stack**: React + Vite + TypeScript + Tailwind (Frontend) | Fastify + TypeScript + Prisma (Backend) | PostgreSQL (Banco)
- **Objetivo**: Dashboard de análise de vendas em tempo real com atualização automática a cada 5 minutos
- **Status Atual**: ✅ **FUNCIONANDO** - Dashboard com cards de faturamento por filial (geral e por período)

## 2. Progresso Atual
- **Última tarefa concluída**: Cards de faturamento por filial (geral e dia/mês) com layout 4 colunas (03/02/2026 16:41)
- **Tarefa em andamento**: Nenhuma
- **Próximos passos**: 
  1. Adicionar mais cards de métricas (vendas por filial, produtos, vendedores)
  2. Implementar gráficos de evolução temporal
  3. Adicionar filtros por período
  4. Deploy na VPS

## 3. Estrutura do Projeto
```
FinanGest/
├── .design-engineer/         # Sistema de design
│   └── system.md             # Design tokens e padrões
├── frontend/                 # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx       # Página principal
│   │   │   ├── Layout.tsx          # Layout com sidebar
│   │   │   ├── Sidebar.tsx         # Navegação lateral
│   │   │   ├── MetricCard.tsx      # Card de métrica reutilizável
│   │   │   ├── FilialCard.tsx      # Card compacto por filial (geral)
│   │   │   └── FilialPeriodCard.tsx# Card compacto por filial com toggle dia/mês
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css              # Tailwind + design tokens Bezerra
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js         # Cores customizadas
│   └── tsconfig.json
├── backend/                  # Fastify + TypeScript + Prisma
│   ├── src/
│   │   ├── routes/
│   │   │   └── vendas.ts          # Rota /api/faturamento-total
│   │   ├── lib/
│   │   │   └── prisma.ts          # Cliente Prisma
│   │   └── server.ts              # Servidor Fastify
│   ├── prisma/
│   │   └── schema.prisma          # Schema do banco (multiSchema)
│   ├── .env                       # Credenciais do banco
│   ├── package.json
│   └── tsconfig.json
├── Dockerfile                # Build único (backend + frontend)
├── .dockerignore
├── .gitignore
├── package.json              # Workspace root
├── README.md
└── PROJETO_STATUS.md
```

## 4. Decisões Arquiteturais

### Frontend
- **React Query com polling de 5 minutos**: Atualização automática sem websockets (mais simples para MVP)
- **Design System**: Baseado em @design-engineer (`.design-engineer/system.md`)
  - Direção: **Data & Analysis + Sophistication & Trust**
  - Identidade: **Autopeças Bezerra** (amarelo #F5AD00 + preto #1F1F1F)
  - Fundação: Cinza claro (#F5F5F5) com sidebar escura
  - Depth: **Borders-only + subtle shadows on hover**
  - Grid: 4px base (8px, 12px, 16px, 24px, 32px)
  - Radius: 8px (soft, profissional)
- **Layout**: Sidebar fixa (200px) + grid responsivo 4 colunas para cards compactos (max 280px)
- **Tailwind CSS**: Utility-first com cores customizadas
- **Lucide Icons**: Ícones modernos e leves

### Backend
- **Fastify**: Mais performático que Express para agregações SQL
- **Prisma**: Type-safety e facilita queries complexas
- **Raw SQL para agregações**: Performance otimizada para cálculo de faturamento (1.4M registros)
- **CORS**: Habilitado apenas em dev, produção serve frontend estático

### Banco de Dados
- **PostgreSQL na VPS**: Banco existente com 1.4M registros
- **Schema**: `auditoria_integracao.auditoria_vendas`
- **Timezone**: America/Sao_Paulo (UTC-3)
- **Query de Faturamento**: `SUM(quantidade * preco_unitario) WHERE faturado = 'S' AND tipo_pedido = '55'` com filtros opcionais de período (dia/mês) na rota `/api/faturamento-por-filial`

### Deploy
- **Dockerfile multi-stage**: Build otimizado (backend + frontend juntos)
- **Backend serve frontend**: Arquivos estáticos servidos pelo Fastify em produção
- **VPS própria**: Deploy via Docker

## 5. Pendências e Problemas

### Pendências
- [ ] Adicionar mais cards de métricas (vendedores, produtos)
- [ ] Implementar gráficos (Recharts)
- [ ] Filtros adicionais (filial, intervalo customizado)
- [ ] Build Docker e deploy na VPS
- [ ] Testes automatizados

### Problemas Conhecidos
- Nenhum no momento

### ✅ Concluído
- [x] Instalar dependências do projeto
- [x] Gerar Prisma Client (com multiSchema)
- [x] Testar conexão com banco PostgreSQL
- [x] Validar cálculo de faturamento total (R$ 124.599.432,57)
- [x] Testar polling de 5 minutos
- [x] Criar sidebar com navegação
- [x] Aplicar identidade visual Autopeças Bezerra
- [x] Criar sistema de design (.design-engineer/system.md)

## 6. Como Rodar

### Instalação
```bash
# Instalar todas as dependências
npm install

# Gerar Prisma Client
cd backend
npx prisma generate
cd ..
```

### Desenvolvimento
```bash
# Rodar frontend + backend simultaneamente
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# API: http://localhost:3000/api/faturamento-total
```

### Build para Produção
```bash
# Build local
npm run build

# Build Docker
docker build -t finangest-dashboard .

# Rodar container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgres://postgres:d2c0655c520bab6ccea5@95.111.255.122:4214/banco-dados-bezerra?sslmode=disable" \
  finangest-dashboard
```

### Testes
```bash
# Testar API manualmente
curl http://localhost:3000/api/faturamento-total
```

## 7. Funcionalidades Implementadas

### ✅ Fase 1 - Setup e Fundação (COMPLETO)
- [x] Estrutura do projeto (monorepo com workspaces)
- [x] Configuração frontend (React + Vite + TypeScript + Tailwind)
- [x] Configuração backend (Fastify + TypeScript)
- [x] Configuração Prisma (schema + conexão com multiSchema)
- [x] Rota API `/api/faturamento-total`
- [x] Componente `Dashboard`
- [x] Componente `MetricCard` (reutilizável)
- [x] Componente `Sidebar` (navegação lateral)
- [x] Componente `Layout` (wrapper com sidebar)
- [x] React Query com polling de 5 minutos
- [x] Design system completo (.design-engineer/system.md)
- [x] Identidade visual Autopeças Bezerra
- [x] Dockerfile para deploy
- [x] README com instruções

### ✅ Fase 2 - Testes e Validação (COMPLETO)
- [x] Instalação de dependências
- [x] Geração de Prisma Client
- [x] Teste de conexão com banco PostgreSQL
- [x] Validação de cálculo de faturamento (R$ 124.599.432,57)
- [x] Teste de atualização automática (5 minutos)
- [x] Servidores rodando (frontend:5173 + backend:3000)
- [x] Rota `/api/faturamento-por-filial` com filtro `?periodo=day|month`
- [x] Card compacto por filial (geral) e card com toggle dia/mês

### ⏳ Fase 3 - Deploy (Pendente)
- [ ] Build Docker
- [ ] Deploy na VPS
- [ ] Validação em produção

### 📊 Fase 4 - Expansão (Futuro)
- [ ] Mais cards de métricas (vendas por filial, por produto, etc)
- [ ] Gráficos de evolução temporal (Recharts)
- [ ] Filtros por período/filial
- [ ] Análise por vendedor
- [ ] Top produtos
- [ ] Dashboard de estoque
- [ ] Relatórios exportáveis

## 8. Design System

### Identidade Visual - Autopeças Bezerra
Extraída do site oficial usando Playwright.

**Cores principais:**
- **Primária (Amarelo/Dourado):** `hsl(42, 100%, 48%)` - #F5AD00
- **Sidebar (Preto):** `hsl(0, 0%, 12%)` - #1F1F1F
- **Background:** `hsl(0, 0%, 96%)` - #F5F5F5
- **Foreground:** `hsl(0, 0%, 15%)` - #262626

**Componentes:**
- **Sidebar:** Fundo preto, logo "BEZERRA AUTOPEÇAS", item ativo em amarelo
- **MetricCard:** Borda sutil, ícone em fundo amarelo/10%, hover com borda amarela
- **Layout:** Sidebar fixa 256px, conteúdo com padding 32px

**Documentação completa:** `.design-engineer/system.md`

## 9. Banco de Dados

### Conexão
- **Host**: 95.111.255.122:4214
- **Database**: banco-dados-bezerra
- **Schema**: auditoria_integracao
- **Tabela**: auditoria_vendas
- **Registros**: ~1.4 milhões

### Estrutura da Tabela `auditoria_vendas`
```sql
id                INTEGER
cod_filial        VARCHAR
tipo_pedido       VARCHAR    -- "55" = pedidos faturados
cod_pedido        VARCHAR
cod_cliente       VARCHAR
cod_produto       VARCHAR
quantidade        NUMERIC
preco_unitario    NUMERIC
data_pedido       TIMESTAMP
faturado          VARCHAR    -- "S" = faturado, "N" = não faturado, "X" = cancelado
cod_vendedor      VARCHAR
data_fatura       TIMESTAMP
hash_registro     VARCHAR
data_extracao     TIMESTAMP
```

### Query Principal
```sql
SELECT 
  COALESCE(SUM(quantidade * preco_unitario), 0)::numeric as total
FROM auditoria_integracao.auditoria_vendas
WHERE faturado = 'S' AND tipo_pedido = '55'
```

---

**Última atualização**: 03/02/2026 16:41 (America/Sao_Paulo)  
**Status**: ✅ Dashboard com cards por filial (geral e dia/mês) compactos em grid 4 col  \
**Servidores**: Frontend (http://localhost:5173) + Backend (http://localhost:3000)
