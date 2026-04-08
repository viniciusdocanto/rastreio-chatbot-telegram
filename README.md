<h1 align="center">
    RastreiaGram
</h1>

<h3 align="center">
    Um chatbot do Telegram para rastrear suas encomendas.
</h3>

<p align="center">
  <a href="#computer-sobre-o-projeto">Sobre o projeto</a> | <a href="#rocket-tecnologias">Tecnologias</a> | <a href="#books-guia-de-instalação-e-execução">Guia de instalação e execução</a>
</p>

![CI Status](https://github.com/viniciusdocanto/rastreio-chatbot-telegram/actions/workflows/ci.yml/badge.svg)

## :computer: Sobre o projeto

O RastreiaGram é um chatbot do Telegram para rastrear suas encomendas de maneira rápida e simples usando os Correios (através da API Link&Track). 
Basta enviar seu código de rastreio que ele trará o último status de atualização.

## :rocket: Tecnologias
 
- [Node.js (v22+)](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [Node Telegram Bot Api](https://github.com/yagop/node-telegram-bot-api)
- [Vitest](https://vitest.dev/) (Testes automatizados)

## :books: Guia de instalação e execução

### Pré-requisitos

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)

### Como executar localmente

***Você deve criar um bot no BotFather do Telegram antes dessa etapa, se você não sabe como fazer [clique aqui](https://medium.com/tht-things-hackers-team/10-passos-para-se-criar-um-bot-no-telegram-3c1848e404c4)***

- Clone o repositório ```git clone https://github.com/nathaliacristina20/rastreio-chatbot-telegram.git```
- Vá até o diretório ```cd rastreio-chatbot-telegram```
- Instale as dependências: ```npm install```
- Copie o arquivo `.env.example` para `.env`
- Abra o arquivo `.env` e preencha com seu token `TOKEN=` obtido pelo BotFather
- Inicie em desenvolvimento: ```npm run dev```

### Como testar

Para rodar a suíte de testes com Vitest:
```bash
npm run test
```

### Como fazer o Deploy no Render

O projeto está configurado para ser publicado facilmente no [Render.com](https://render.com/).
1. Crie um novo Web Service ligado ao seu repositório Github.
2. Build Command: `npm install && npx prisma generate && npm run build`
3. Start Command: `npm start`
4. Vá em Environment Variables e adicione `TOKEN`, `TRACKING_API_TOKEN` e `DATABASE_URL` (valor: `file:./dev.db`).

## :page_with_curl: Licença

Esse projeto está sob a licença MIT. 
<hr />
<p>by Nathalia Cristina :wave: <a href="https://linktr.ee/nathaliacristina20">Get in touch!</a></p>
