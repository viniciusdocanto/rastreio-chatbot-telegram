import http, { IncomingMessage, ServerResponse } from "http";
import app from "./app";
import { MessageFromChat } from "./shared/interfaces/i.chat";
import IntentsRunService from "./app/services/IntentsRunService";
import TrackingService from "./app/services/TrackingService";
import NotificationService from "./app/services/NotificationService";
import TrackingController from "./app/controllers/TrackingController";
import { messages } from "./shared/messages";
import { REGEX_TRACKING } from "./shared/regex";

// Servidor de Health Check para o Render
const port = process.env.PORT || 8080;
http.createServer((_req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Bot is running!");
  res.end();
}).listen(port);
console.log(`[HealthCheck] Server running on port ${port}`);

// Inicializa o serviço de notificações automáticas
NotificationService.init(app);


app.on("message", async (msg: MessageFromChat) => {
  try {
    if (!msg.text) return;

    const chatId = msg.chat.id.toString();
    const client_response = msg.text.toString().trim();
    const firstName = msg.from?.first_name || 'Usuário';

    // Comando: Listar meus rastreios
    if (client_response === '/meus_rastreios') {
      const myTracks = await TrackingService.getByUser(chatId);
      if (myTracks.length === 0) {
        return await app.sendMessage(chatId, "Você ainda não tem nenhum pacote sendo monitorado.");
      }
      
      let listMsg = "<b>Seus Pacotes Monitorados:</b>\n\n";
      myTracks.forEach(t => {
        listMsg += `📦 <code>${t.code}</code> - ${t.description || 'Sem descrição'}\n`;
      });
      listMsg += "\n<i>Para parar de seguir, use: /remover CODIGO</i>";
      return await app.sendMessage(chatId, listMsg, { parse_mode: 'HTML' });
    }

    // Comando: Remover rastreio
    if (client_response.startsWith('/remover')) {
      const codeMatch = client_response.match(REGEX_TRACKING);
      if (codeMatch) {
        await TrackingService.delete(chatId, codeMatch[0]);
        return await app.sendMessage(chatId, `✅ O código <code>${codeMatch[0]}</code> foi removido da sua lista de monitoramento.`, { parse_mode: 'HTML' });
      }
      return await app.sendMessage(chatId, "Por favor, digite o código que deseja remover. Ex: /remover AA123456789BR");
    }

    // Fluxo Normal: Intents / Consulta Manual
    const match = await IntentsRunService.execute(client_response);

    if (typeof match === "string") {
      const messageText = match.replace('{name}', firstName);
      await app.sendMessage(chatId, messageText, { parse_mode : 'HTML' });

      // Se foi um rastreio com sucesso, salva no banco para notificações futuras
      const codeMatch = client_response.match(REGEX_TRACKING);
      if (codeMatch && !match.includes(messages.INVALID_CODE) && !match.includes("Erro")) {
        const rawData = await TrackingController.getRawData(codeMatch[0]);
        await TrackingService.save(chatId, codeMatch[0], firstName, rawData.description, rawData.lastEventDate);
        console.log(`[Persistence] Tracking salvo para ${firstName}: ${codeMatch[0]}`);
      }

    } else if (match && typeof match === "object" && match.answers) {
      const answers = match.answers;
      if (answers.length > 0) {
          if (match.buttons && match.buttons.length > 0) {
            const kbButtons = match.buttons.map(btn => ({ text: btn }));
            await app.sendMessage(
                chatId, answers[0].replace('{name}', firstName),
                {
                  reply_markup: {
                    keyboard: [kbButtons],
                    resize_keyboard: true,
                    one_time_keyboard: true
                  },
                  parse_mode: 'HTML'
                }
            );
          } else {
            await app.sendMessage(chatId, answers[0].replace('{name}', firstName), { parse_mode: 'HTML' });
          }
      }
    }
  } catch (error) {
    console.error("[INDEX Message Error]", error);
    try {
        if (msg.chat && msg.chat.id) {
            await app.sendMessage(msg.chat.id, messages.GENERIC_ERROR);
        }
    } catch (e) {
        console.error("Could not send fallback error message", e);
    }
  }
});
