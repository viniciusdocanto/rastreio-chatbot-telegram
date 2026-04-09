import http, { IncomingMessage, ServerResponse } from "http";
import dotenv from "dotenv";

dotenv.config();

// O servidor HTTP PRECISA subir antes de qualquer outra coisa.
// No CommonJS (output do tsc), `import` vira `require()` no topo.
// Se app.ts lançar (TOKEN ausente), o processo morre antes do listen().
// Usando importações dinâmicas (await import) dentro de uma função async,
// garantimos que o servidor já esteja escutando antes de inicializar o bot.

const port = process.env.PORT || 8080;

http
  .createServer((_req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bot is running!");
  })
  .listen(port, () => {
    console.log(`[HealthCheck] Server running on port ${port}`);
    void initBot();
  });

async function initBot(): Promise<void> {
  try {
    const { default: app } = await import("./app");
    const { default: NotificationService } = await import(
      "./app/services/NotificationService"
    );
    const { default: IntentsRunService } = await import(
      "./app/services/IntentsRunService"
    );
    const { default: TrackingService } = await import(
      "./app/services/TrackingService"
    );
    const { default: TrackingController } = await import(
      "./app/controllers/TrackingController"
    );
    const { messages } = await import("./shared/messages");
    const { REGEX_TRACKING } = await import("./shared/regex");

    // Inicializa o serviço de notificações automáticas
    NotificationService.init(app);

    app.on("message", async (msg) => {
      try {
        const chatMsg = msg as {
          text?: string;
          chat: { id: number };
          from?: { first_name?: string };
        };

        if (!chatMsg.text) return;

        const chatId = chatMsg.chat.id.toString();
        const client_response = chatMsg.text.toString().trim();
        const firstName = chatMsg.from?.first_name || "Usuário";

        // Comando: Listar meus rastreios
        if (client_response === "/meus_rastreios") {
          const myTracks = await TrackingService.getByUser(chatId);
          if (myTracks.length === 0) {
            return await app.sendMessage(
              chatId,
              "Você ainda não tem nenhum pacote sendo monitorado."
            );
          }

          let listMsg = "<b>Seus Pacotes Monitorados:</b>\n\n";
          myTracks.forEach((t) => {
            listMsg += `📦 <code>${t.code}</code> - ${t.description || "Sem descrição"}\n`;
          });
          listMsg += "\n<i>Para parar de seguir, use: /remover CODIGO</i>";
          return await app.sendMessage(chatId, listMsg, {
            parse_mode: "HTML",
          });
        }

        // Comando: Remover rastreio
        if (client_response.startsWith("/remover")) {
          const codeMatch = client_response.match(REGEX_TRACKING);
          if (codeMatch) {
            await TrackingService.delete(chatId, codeMatch[0]);
            return await app.sendMessage(
              chatId,
              `✅ O código <code>${codeMatch[0]}</code> foi removido da sua lista de monitoramento.`,
              { parse_mode: "HTML" }
            );
          }
          return await app.sendMessage(
            chatId,
            "Por favor, digite o código que deseja remover. Ex: /remover AA123456789BR"
          );
        }

        // Fluxo Normal: Intents / Consulta Manual
        const match = await IntentsRunService.execute(client_response);

        if (typeof match === "string") {
          const messageText = match.replace("{name}", firstName);
          await app.sendMessage(chatId, messageText, { parse_mode: "HTML" });

          // Se foi um rastreio com sucesso, salva no banco para notificações futuras
          const codeMatch = client_response.match(REGEX_TRACKING);
          if (
            codeMatch &&
            !match.includes(messages.INVALID_CODE) &&
            !match.includes("Erro")
          ) {
            const rawData = await TrackingController.getRawData(codeMatch[0]);
            await TrackingService.save(
              chatId,
              codeMatch[0],
              firstName,
              rawData.description,
              rawData.lastEventDate
            );
            console.log(
              `[Persistence] Tracking salvo para ${firstName}: ${codeMatch[0]}`
            );
          }
        } else if (match && typeof match === "object" && match.answers) {
          const answers = match.answers;
          if (answers.length > 0) {
            if (match.buttons && match.buttons.length > 0) {
              const kbButtons = match.buttons.map((btn: string) => ({
                text: btn,
              }));
              await app.sendMessage(
                chatId,
                answers[0].replace("{name}", firstName),
                {
                  reply_markup: {
                    keyboard: [kbButtons],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                  },
                  parse_mode: "HTML",
                }
              );
            } else {
              await app.sendMessage(
                chatId,
                answers[0].replace("{name}", firstName),
                { parse_mode: "HTML" }
              );
            }
          }
        }
      } catch (error) {
        console.error("[INDEX Message Error]", error);
        try {
          const chatMsg = msg as { chat?: { id?: number } };
          if (chatMsg.chat && chatMsg.chat.id) {
            const { messages } = await import("./shared/messages");
            await app.sendMessage(chatMsg.chat.id, messages.GENERIC_ERROR);
          }
        } catch (e) {
          console.error("Could not send fallback error message", e);
        }
      }
    });

    console.log("[Bot] Telegram bot initialized successfully.");
  } catch (error) {
    console.error("[FATAL] Bot initialization failed:", error);
    // O servidor HTTP continua rodando para manter o health check ativo.
  }
}
