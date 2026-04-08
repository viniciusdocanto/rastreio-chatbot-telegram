import { messages } from "../../shared/messages";

class TrackingController {
    async index(trackingCode: string): Promise<string> {
        try {
            const url = `https://api.linketrack.com/track/json?user=teste&token=1e4B444A28B10D36A4137E31370F70BE125A55B2CCAE7E3783CD6A0B909D3F37&codigo=${trackingCode.toUpperCase()}`;
            
            const response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (response.status === 429) {
                return "O sistema de rastreamento está congestionado no momento. Tente novamente em alguns minutos.";
            }

            if (!response.ok) {
                // Return invalid code or generic error depending on status
                if (response.status === 404 || response.status === 400 || response.status === 401) {
                    return messages.INVALID_CODE;
                }
                return messages.GENERIC_ERROR;
            }

            const data = await response.json() as any;

            // Check if there are tracking events
            if (!data || !data.eventos || data.eventos.length === 0) {
                 return "Ainda não há atualizações para este código de rastreamento.";
            }

            // Get the last event (eventos[0] is typically the most recent in linketrack)
            const track = data.eventos[0];
            let message = "";

            // Format date appropriately (LinkeTrack format: "DD/MM/YYYY HH:mm")
            const trackingDateStr = `${track.data} ${track.hora}`;

            message += track.status ? `<b>${track.status}</b>\n` : '';
            message += track.subStatus && track.subStatus.length > 0 ? `${track.subStatus[0]}\n` : '';
            message += track.local ? `Local: ${track.local.toUpperCase()}\n` : '';
            message += trackingDateStr ? `${trackingDateStr}\n` : '';
            
            return message;

        } catch (error) {
            console.error("[TrackingController Error]", error);
            return messages.GENERIC_ERROR;
        }
    }
}

export default new TrackingController();
