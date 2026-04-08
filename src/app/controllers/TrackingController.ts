import { messages } from "../../shared/messages";

class TrackingController {
    async index(trackingCode: string): Promise<string> {
        const result = await this.getRawData(trackingCode);
        return result.message;
    }

    async getRawData(trackingCode: string): Promise<{ message: string, lastEventDate: string, description: string }> {
        try {
            const apiToken = process.env.TRACKING_API_TOKEN; 

            if (!apiToken) {
                // FALLBACK: Mock para portfólio
                await new Promise(resolve => setTimeout(resolve, 800));
                
                const dataStr = new Date().toLocaleDateString('pt-BR');
                const horaStr = new Date().toLocaleTimeString('pt-BR');
                const lastEventDate = `${dataStr} ${horaStr}`;

                return {
                    message: `<b>Objeto em trânsito (Mock)</b>\nLocal: UNIDADE DE TRATAMENTO - SAO PAULO/SP\n${lastEventDate}\n\n<i>(Insira seu TRACKING_API_TOKEN da Wonca no .env para dados reais)</i>`,
                    lastEventDate,
                    description: "Objeto em trânsito (Mock)"
                };
            }

            const url = "https://api-labs.wonca.com.br/wonca.labs.v1.LabsService/Track";
            const requestBody = JSON.stringify({ "code": trackingCode.toUpperCase() });
            
            // LOG DE ENVIO PARA DEBUG
            console.log("[Wonca Request]", {
                url,
                headers: { "Content-Type": "application/json", "Authorization": "Apikey ***" },
                body: requestBody
            });

            const response = await fetch(url, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Apikey ${apiToken}`
                },
                body: requestBody
            }) as any;

            if (response.status === 429) {
                return { message: "O sistema está congestionado no momento. Tente novamente em alguns minutos.", lastEventDate: "", description: "" };
            }

            if (!response.ok) {
                // Erro de API: Retornando código inválido ou erro genérico
                if (response.status === 404 || response.status === 400 || response.status === 401) {
                    return { message: messages.INVALID_CODE, lastEventDate: "", description: "" };
                }
                return { message: messages.GENERIC_ERROR, lastEventDate: "", description: "" };
            }

            const data = await (response as any).json();
            
            // LOG DE DEBUG PARA VALIDAR ESTRUTURA
            console.log("[Wonca API Response]", JSON.stringify(data, null, 2));

            // A Wonca retorna o resultado principal dentro de uma string escapada no campo 'json'
            let innerData = data;
            if (typeof data.json === "string") {
                try {
                    innerData = JSON.parse(data.json);
                } catch (e) {
                    console.error("[Wonca Parse Error]", e);
                }
            }

            const events = innerData.eventos || innerData.events || [];

            if (!events || events.length === 0) {
                 return { message: "Ainda não há atualizações para este código de rastreamento.", lastEventDate: "", description: "" };
            }

            const track = events[0];
            let message = "";

            // Mapeamento preciso para a estrutura da Wonca
            const description = track.descricao || track.description || track.status || "Status não informado";
            const dateValue = track.dtHrCriado?.date || track.dtHrCriado || track.date || track.data || "";
            
            // Localização (Cidade/UF)
            let location = "Local não informado";
            if (track.unidade && track.unidade.endereco) {
                const { cidade, uf } = track.unidade.endereco;
                location = `${cidade || ""}${uf ? " / " + uf : ""}`.trim() || location;
            }

            message += `<b>${description}</b>\n`;
            message += `📍 ${location.toUpperCase()}\n`;
            
            let cleanDate = "";
            if (dateValue) {
                cleanDate = typeof dateValue === "string" ? dateValue.split('.')[0] : dateValue;
                message += `📅 ${cleanDate}\n`;
            }
            
            return { message, lastEventDate: cleanDate, description };

        } catch (error: any) {
            console.error("[TrackingController Error]", error.message || error);
            const fallbackMsg = (error.cause && error.cause.code === 'ENOTFOUND') 
                ? "Infelizmente, o serviço público de rastreios está temporariamente fora do ar. 😔\nTente novamente mais tarde!"
                : messages.GENERIC_ERROR;
            return { message: fallbackMsg, lastEventDate: "", description: "" };
        }
    }
}

export default new TrackingController();
