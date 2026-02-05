# FinanGest - Dashboard de Análise de Vendas

Dashboard em tempo real para análise de vendas com atualização automática a cada 5 minutos.

## 🚀 Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Fastify + TypeScript
- **Banco**: PostgreSQL (VPS)
- **ORM**: Prisma
- **Atualização**: React Query com polling de 5 minutos

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
cd backend
npx prisma generate
cd ..
```

## 🔧 Desenvolvimento

```bash
# Rodar frontend e backend simultaneamente
npm run dev

# Ou separadamente:
npm run dev:frontend  # http://localhost:5173
npm run dev:backend   # http://localhost:3000
```

## 🏗️ Build para Produção

```bash
npm run build
```

## 📊 Funcionalidades

- ✅ Card de Faturamento Total
- ✅ Atualização automática a cada 5 minutos
- ✅ Sem autenticação (dashboard público)
- ✅ Design moderno e responsivo

## 🚀 Deploy no Easypanel

### Pré-requisitos
- Conta no Easypanel
- Repositório GitHub: https://github.com/juliolopes-dev/FinanGest.git
- Banco PostgreSQL acessível

### Passo a Passo

1. **No Easypanel, crie um novo App:**
   - Clique em "Create" → "App"
   - Nome: `finangest`
   - Source: GitHub
   - Repository: `juliolopes-dev/FinanGest`
   - Branch: `main`

2. **Configure as Variáveis de Ambiente:**
   ```env
   DATABASE_URL=postgresql://usuario:senha@host:5432/nome_banco?schema=auditoria_integracao
   NODE_ENV=production
   PORT=3000
   TZ=America/Sao_Paulo
   ```

3. **Configure o Build:**
   - Build Method: `Dockerfile`
   - Dockerfile Path: `./Dockerfile`
   - Port: `3000`

4. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o build (2-3 minutos)
   - Acesse via URL fornecida pelo Easypanel

### Variáveis de Ambiente Necessárias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão PostgreSQL | `postgresql://user:pass@host:5432/db?schema=auditoria_integracao` |
| `NODE_ENV` | Ambiente de execução | `production` |
| `PORT` | Porta do servidor | `3000` |
| `TZ` | Timezone | `America/Sao_Paulo` |

### Troubleshooting

**Erro de conexão com banco:**
- Verifique se o PostgreSQL está acessível externamente
- Confirme usuário, senha e nome do banco
- Teste conexão: `psql -h HOST -U USER -d DATABASE`

**Build falha:**
- Verifique logs no Easypanel
- Confirme que todas as dependências estão no `package.json`
- Teste build local: `docker build -t finangest .`

**App não inicia:**
- Verifique variável `DATABASE_URL`
- Confirme que schema `auditoria_integracao` existe
- Rode Prisma generate: `npx prisma generate`

## 🎯 Próximos Passos

- Adicionar mais cards de métricas
- Gráficos de evolução temporal
- Filtros por período/filial
- Análise por produto/vendedor
