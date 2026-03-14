# DevReview

Ferramenta de code review assistida por IA — projeto base do Curso 5: MCP, Conectando o Agent ao Mundo Real.

## Stack

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS, shadcn/ui, Redux Toolkit
- **Backend (construído durante o curso):** Node.js, @modelcontextprotocol/sdk, Zod
- **Banco de dados:** Supabase (PostgreSQL)

## Pré-requisitos

- Node.js 20+
- npm 10+
- Supabase CLI (`npm install -g supabase`)

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o Supabase local
npx supabase start

# 3. Aplicar migrations e seed data
npx supabase db reset

# 4. Copiar variáveis de ambiente
cp apps/web/.env.example apps/web/.env

# 5. Iniciar o frontend
npm run dev
```

O app abre em `http://localhost:5173`.
O Supabase Studio fica em `http://localhost:54323`.

## Estrutura

```
devreview/
├── apps/
│   ├── web/          # Frontend React
│   └── mcp-server/   # MCP Server (construído durante o curso)
├── supabase/         # Configuração, migrations e seed data
└── docs/             # Documentação do curso (gitignored)
```
