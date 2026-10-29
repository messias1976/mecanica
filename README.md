# AutoManager — Oficina Pro

Aplicação React + Vite para gestão de uma oficina mecânica, com autenticação e persistência online via Supabase.

## Funcionalidades
- Dashboard de faturamento, orçamentos, serviços em execução e alertas de estoque.
- Ordens de serviço com cliente/veículo, checklist, peças, serviços, totais, status e WhatsApp.
- Clientes e veículos com múltiplos veículos e histórico de OS.
- Estoque com custo, preço de venda, margem e estoque mínimo.
- Login por e-mail e senha via Supabase Auth.
- PostgreSQL com Row Level Security (RLS) por usuário autenticado.

## Requisitos
- Node.js 20 ou superior, npm e projeto Supabase.

## Configuração do banco e autenticação
1. Crie um projeto em https://supabase.com/.
2. No Supabase, abra **SQL Editor** e execute `supabase/migrations/001_initial_schema.sql`.
3. Em **Authentication → Users**, crie manualmente o usuário da oficina. O app não oferece cadastro público.
4. Copie a Project URL e a chave **Publishable** (`sb_publishable_...`) em Project Settings → API Keys (ou Connect). Projetos antigos também podem usar a chave `anon`.
5. Copie `.env.example` para `.env.local` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY (ou VITE_SUPABASE_ANON_KEY para projetos antigos)`.
6. Nunca use a chave `service_role` no frontend nem a envie ao GitHub.

## Executar localmente
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Publicar
Importe o repositório no Vercel ou outro serviço de hospedagem estática com suporte a Vite. Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` como variáveis de ambiente, use `npm run build` e pasta de saída `dist`, depois faça deploy novamente.

## Segurança e limitações conhecidas
- RLS limita os registros ao usuário autenticado que os criou/possui.
- Crie apenas usuários autorizados no Supabase Auth; não habilite cadastro público.
- Use somente a chave pública/Publishable no navegador. A chave service_role nunca deve ser exposta.
- Os registros são armazenados em JSONB; validação de negócio ainda ocorre principalmente no frontend. Para operação crítica, recomenda-se validação adicional no banco/servidor e testes de segurança.
- Esta versão não implementa backups próprios, trilha de auditoria, recuperação de desastre, controle automático de estoque por OS ou testes automatizados completos. Configure backups no plano escolhido e teste a restauração antes do uso comercial.
- A base inicia vazia; os dados demonstrativos antigos não são importados.
