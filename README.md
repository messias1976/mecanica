# AutoManager — Oficina Pro

Aplicação React + Vite para gestão operacional de oficinas mecânicas.

## Funcionalidades
- Dashboard com faturamento de ordens concluídas/entregues, orçamentos pendentes, execução e alertas de estoque.
- Ordens de serviço: cadastro e edição, cliente/veículo, checklist de entrada, peças, serviços, totais, status e detalhes.
- Envio de orçamento pelo WhatsApp com mensagem pré-preenchida.
- Clientes e veículos: cadastro, edição, múltiplos veículos e histórico de OS.
- Estoque: cadastro/edição de peças, custo, preço de venda, margem e alerta de estoque mínimo.
- Persistência local usando `localStorage`, para manter os dados no mesmo navegador após recarregar.

## Requisitos
- Node.js 20 ou superior
- npm

## Executar localmente
```bash
npm install
npm run dev
```

## Gerar build de produção
```bash
npm run build
npm run preview
```

## Observações importantes
- Os dados são armazenados no navegador atual; não há backend, sincronização entre dispositivos, autenticação ou backup remoto nesta versão.
- Os dados iniciais são exemplos demonstrativos. Remova-os ou altere-os para uso real.
- O status de uma OS não debita automaticamente as peças do estoque. Registre movimentos de estoque manualmente até integrar esse fluxo.
- O faturamento do painel considera somente ordens com status **Concluído** ou **Entregue**.
