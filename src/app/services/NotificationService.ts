import cron from 'node-cron';
import TelegramBot from 'node-telegram-bot-api';
import TrackingService from './TrackingService';
import TrackingController from '../controllers/TrackingController';

class NotificationService {
    private bot: TelegramBot | null = null;

    init(bot: TelegramBot) {
        this.bot = bot;
        
        // Agendar tarefa: Roda a cada 2 horas
        // Formato: '0 */2 * * *' (A cada 2 horas)
        // Para testes: '*/5 * * * *' (A cada 5 minutos)
        cron.schedule('0 */2 * * *', () => {
            console.log("[NotificationService] Iniciando checagem de atualizações...");
            this.checkUpdates();
        });

        console.log("[NotificationService] Job de notificações agendado com sucesso.");
    }

    async checkUpdates() {
        if (!this.bot) return;

        try {
            const trackings = await TrackingService.getAll();

            for (const tracking of trackings) {
                const newData = await TrackingController.getRawData(tracking.code);

                // Se houver uma nova data de atualização, notifica o usuário
                if (newData.lastEventDate && newData.lastEventDate !== tracking.lastEventDate) {
                    const message = `📦 <b>Atualização de Rastreio!</b>\nCode: <code>${tracking.code}</code>\n\n${newData.message}`;
                    
                    await this.bot.sendMessage(tracking.chatId, message, { parse_mode: 'HTML' });

                    // Atualiza o banco com a nova data para não notificar repetido
                    await TrackingService.save(
                        tracking.chatId, 
                        tracking.code, 
                        tracking.userName || '', 
                        newData.description, 
                        newData.lastEventDate
                    );

                    console.log(`[NotificationService] Notificação enviada para ${tracking.chatId} sobre o código ${tracking.code}`);
                }
            }
        } catch (error) {
            console.error("[NotificationService Error]", error);
        }
    }
}

export default new NotificationService();
