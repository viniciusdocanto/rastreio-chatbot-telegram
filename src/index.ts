import app from "./app";
import { MessageFromChat } from "./shared/interfaces/i.chat";
import IntentsRunService from "./app/services/IntentsRunService";
import { messages } from "./shared/messages";

app.on("message", async (msg: MessageFromChat) => {
  try {
    if (!msg.text) return; // Ignore messages without text (photos, stickers, etc)

    const chatId = msg.chat.id;
    const client_response = msg.text.toString().trim();

    const match = await IntentsRunService.execute(client_response);

    if (typeof match === "string") {
      const messageText = match.replace('{name}', msg.from?.first_name || 'Usuário');
      await app.sendMessage(chatId, messageText, { parse_mode : 'HTML' });
    } else if (match && typeof match === "object" && match.answers) {
      const answers = match.answers;
      if (answers.length > 0) {
          if (match.buttons && match.buttons.length > 0) {
            const kbButtons = match.buttons.map(btn => ({ text: btn }));
            await app.sendMessage(
                chatId, answers[0],
                {
                  reply_markup: {
                    keyboard: [kbButtons],
                    resize_keyboard: true,
                    one_time_keyboard: true
                  },
                }
            );
          } else {
            await app.sendMessage(chatId, answers[0]);
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
