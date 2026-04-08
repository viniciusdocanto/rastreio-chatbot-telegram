# Changelog

## [1.1.0] - 2026-04-08
### Changed
- Substituição da dependência queixosa `rastrojs` por chamadas diretas a API REST do `Link&Track`.
- Migração de `yarn` para `npm`.
- Atualização do motor de inferência de intents (`IntentsRunService`) para suporte à tipagem estrita de Promises e normalização de falas (acentuação e capitalização).
- Atualização global das dependências (Node 22, TypeScript 5, node-telegram-bot-api e outras libs base).
- Otimização do arquivo `tsconfig.json` voltado a ES2020.
- Tratativa de falhas via Try/Catch global previnido memory leaks e node crash-exits.

### Added
- Workflow de CI para Github Actions.
- Suite de testes com `vitest` focado em controlers e utilitários.
- Pipeline de tipagem com `@typescript-eslint`.
