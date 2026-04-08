# Changelog

## [1.1.2] - 2026-04-08
### Fixed
- Correção de erro de deploy no Render (módulo `dist/index.js` não encontrado).
- Correção de múltiplos erros de compilação TypeScript no Render (falta de `@types/node` e conflitos de modo estrito).
- Correção de timeout de porta no Render (adicionado servidor de health check).

### Added
- Script `render-build` para facilitar a configuração em ambientes de PaaS.


## [1.1.1] - 2026-04-08
### Fixed
- Correção de 15 vulnerabilidades de segurança (incluindo 2 críticas e 1 alta).
- Implementação de `overrides` no `package.json` para forçar versões seguras de dependências transitivas (`form-data`, `qs`, `tough-cookie`, `esbuild`).
- Atualização do `vitest` para v4.1.3.
- Ajuste no script de teste para excluir o diretório `dist`.


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
