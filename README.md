<h1 align="center">
    RastreiaGram
</h1>

<h3 align="center">
    Um chatbot do Telegram para rastrear suas encomendas.
</h3>

<p align="center">
  <a href="#computer-sobre-o-projeto">Sobre o projeto</a> | <a href="#rocket-tecnologias">Tecnologias</a> | <a href="#sparkles-funcionalidades">Funcionalidades</a> | <a href="#books-guia-de-instalação-e-execução">Guia de instalação e execução</a>
</p>

![CI Status](https://github.com/viniciusdocanto/rastreio-chatbot-telegram/actions/workflows/ci.yml/badge.svg)

## :computer: Sobre o projeto

O RastreiaGram é um chatbot do Telegram para monitoramento e rastreio automático de encomendas.
Basta enviar o código de rastreamento no chat para obter as últimas atualizações do objeto e salvá-lo para receber notificações automáticas periódicas.

## :rocket: Tecnologias

- [Node.js (v22+)](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/) (SQLite)
- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
- [Wonca API](https://wonca.com.br/) (API de Rastreamento)
- [node-cron](https://github.com/node-cron/node-cron) (Agendamento de notificações automáticas)
- [Vitest](https://vitest.dev/) (Testes automatizados)

## :sparkles: Funcionalidades

- **Consulta de encomendas**: Envie um código de rastreio (ex: `AA123456789BR`) para obter o status atualizado.
- **Listar rastreios**: Use o comando `/meus_rastreios` para visualizar todas as suas encomendas monitoradas.
- **Remover rastreio**: Use o comando `/remover CODIGO` para parar de receber atualizações de um pacote.
- **Notificações automáticas**: Verificação periódica de atualizações a cada 2 horas, enviando mensagens no Telegram quando houver novo evento.

## :books: Guia de instalação e execução

### Pré-requisitos

- [Git](https://git-scm.com/)
- [Node.js (v22+)](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)

### Como executar localmente

***Você deve criar um bot no BotFather do Telegram antes dessa etapa. Se não sabe como fazer, [clique aqui](https://medium.com/tht-things-hackers-team/10-passos-para-se-criar-um-bot-no-telegram-3c1848e404c4).***

1. Clone o repositório:
   ```bash
   git clone https://github.com/viniciusdocanto/rastreio-chatbot-telegram.git
   cd rastreio-chatbot-telegram
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env`:
   ```env
   TOKEN=seu_token_telegram_aqui
   TRACKING_API_TOKEN=seu_token_wonca_api_aqui
   DATABASE_URL="file:./prisma/dev.db"
   PORT=8080
   ```

4. Gere os artefatos do Prisma e rode as migrações:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Inicie em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

### Scripts disponíveis

- `npm run dev`: Executa a aplicação em modo de desenvolvimento com `ts-node-dev`.
- `npm run build`: Gera os tipos do Prisma e compila o código TypeScript para `dist/`.
- `npm start`: Inicia a aplicação compilada em produção.
- `npm run test`: Executa os testes automatizados com Vitest.
- `npm run typecheck`: Executa a verificação estática de tipos do TypeScript.
- `npm run lint`: Executa a análise estática com ESLint.

### Como fazer o Deploy no Render

O projeto está configurado para ser publicado facilmente no [Render.com](https://render.com/).

1. Crie um novo **Web Service** conectado ao seu repositório GitHub.
2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`
4. Adicione as **Environment Variables**:
   - `TOKEN`: Token do Bot no Telegram.
   - `TRACKING_API_TOKEN`: Token da API Wonca.
   - `DATABASE_URL`: `file:./prisma/dev.db`
   - `PORT`: O Render define isso automaticamente.

## :page_with_curl: Licença

Esse projeto está sob a licença MIT. 

<hr />
<p>by <a href="https://github.com/viniciusdocanto">Vinicius do Canto</a> :wave:</p>
