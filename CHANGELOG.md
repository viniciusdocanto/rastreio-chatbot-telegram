# Changelog

## [1.1.7] - 2026-04-09
### Fixed
- Corrigido erro de porta não detectada no Render (`Port scan timeout reached`).
- Reestruturado `index.ts` para usar importações dinâmicas (`await import()`): o servidor HTTP de health check agora sobe antes de qualquer código que possa lançar exceção (ex: `TOKEN` ausente).
- No modelo CommonJS gerado pelo `tsc`, as importações estáticas são elevadas (`require()` no topo), fazendo o processo encerrar antes do `.listen()` quando o bot falhava na inicialização. As importações dinâmicas garantem a ordem correta de execução.

## [1.1.6] - 2026-04-08
### Fixed
- Corrigido erro `TS2307: Cannot find module 'vitest'` durante o build de produção no Render.
- Adicionados padrões `**/__tests__/**`, `**/*.test.ts` e `**/*.spec.ts` ao array `exclude` do `tsconfig.json`, impedindo que arquivos de teste sejam incluídos na compilação TypeScript.

## [1.1.5] - 2026-04-08
### Fixed
- Corrigido definitivamente o erro `TS2688: Cannot find type definition file for 'node'` no build do Render.
- Adicionado `"types": ["node"]` explicitamente no `tsconfig.json` para garantir resolução correta dos tipos.
- Movidos `@types/node`, `@types/node-cron` e `@types/node-telegram-bot-api` para `dependencies`, assegurando instalação em ambientes de build que não instalam `devDependencies`.

## [1.1.4] - 2026-04-08
### Fixed
- Correção do erro `TS2688` no Render através da otimização da descoberta automática de tipos no `tsconfig.json`.

## [1.1.3] - 2026-04-08
### Fixed
- Correção de múltiplos erros de compilação TypeScript no Render (falta de reconhecimento de `fetch`, `console` e `process`).
- Correção da versão do `vitest` que estava incorreta no `package.json`.
- Mapeamento correto de `@types` para `devDependencies`.
- Inclusão da biblioteca `DOM` no `tsconfig.json` para garantir compatibilidade com `fetch` global.


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
