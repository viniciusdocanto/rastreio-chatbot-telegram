import { messages } from "../../shared/messages";

class TrackingController {
    async index(trackingCode: string): Promise<string> {
        try {
            // =========================================================================
            // AVISO IMPORTANTE: A API gratuita (Link&Track / Correios-Brasil aberta) 
            // foi derrubada por conta de bloqueios anti-bot dos Correios em 2024+.
            // Abaixo, um MOCK foi implementado para fins de teste do bot local, 
            // e uma instrução de integração com API Keys oficiais foi deixada comentada.
            // =========================================================================

            // Verifica se possui token real para uma API Paga/Oficial.
            // Exemplo usando linketrack autenticado na V2 ou Api dos Correios original:
            const apiToken = process.env.TRACKING_API_TOKEN; 

            if (!apiToken) {
                // FALLBACK: Retornando mock se não houver Token configurado.
                // Isso permite que você mostre o bot funcionando para seu portfólio.
                
                // Simulação de delay de requisição de 1 segundo
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const dataStr = new Date().toLocaleDateString('pt-BR');
                const horaStr = new Date().toLocaleTimeString('pt-BR');

                return `<b>Objeto em trânsito - por favor aguarde</b>\nLocal: UNIDADE DE TRATAMENTO - SAO PAULO/SP\n${dataStr} ${horaStr}\n\n<i>(Obs: Este é um Tracking Simulado. Insira seu TRACKING_API_TOKEN no .env para dados reais)</i>`;
            }

            const url = `https://api.rastreabilidade.correios.com.br/v1/sro-rastro/${trackingCode.toUpperCase()}`;
            const response = await fetch(url, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}` // API token configurado
                }
            });

            if (response.status === 429) {
                return "O sistema está congestionado no momento. Tente novamente em alguns minutos.";
            }

            if (!response.ok) {
                if (response.status === 404 || response.status === 400 || response.status === 401) {
                    return messages.INVALID_CODE; // Código não encontrado
                }
                return messages.GENERIC_ERROR;
            }

            const data = await response.json() as any;

            if (!data || !data.objetos || data.objetos.length === 0 || !data.objetos[0].eventos || data.objetos[0].eventos.length === 0) {
                 return "Ainda não há atualizações para este código de rastreamento.";
            }

            const track = data.objetos[0].eventos[0];
            let message = "";

            message += track.descricao ? `<b>${track.descricao}</b>\n` : '';
            message += track.unidade ? `Local: ${track.unidade.tipo} - ${track.unidade.endereco?.cidade}/${track.unidade.endereco?.uf}\n` : '';
            message += track.dtHrCriado ? `${new Date(track.dtHrCriado).toLocaleString('pt-BR')}\n` : '';
            
            return message;

        } catch (error: any) {
            console.error("[TrackingController Error]", error.message || error);
            
            // Se for falha de fetch (ex: DNS down da API) retorna algo mais amigável
            if (error.cause && error.cause.code === 'ENOTFOUND') {
                return "Infelizmente, o serviço público de rastreios está temporariamente fora do ar. 😔\nTente novamente mais tarde!";
            }

            return messages.GENERIC_ERROR;
        }
    }
}

export default new TrackingController();
