import { messages } from "../../shared/messages";
import { intents } from "../../shared/intents";
import { Intent } from "../../shared/interfaces/i.intent";
import { runRegex, normalizeText } from "../../shared/util/functions";
import { Random } from 'random-js';

const random = new Random();

class IntentsRunService {
    async execute(message: string): Promise<Intent | string> {
        let match: Intent | undefined;

        for (const intent of intents) {
            if (intent.pattern) {
                if (runRegex(intent.pattern, message)) {
                    match = intent;
                    break;
                }
            } else {
                const normalizedMessage = normalizeText(message);
                const normalizedUtterances = intent.utterances.map(u => normalizeText(u));
                
                if (normalizedUtterances.includes(normalizedMessage)) {
                    match = intent;
                    break;
                }
            }
        }

        if (match) {
            if (match.function) {
                try {
                    const response = await match.function(message);
                    return response;
                } catch (error) {
                    console.error("[IntentRunService Error]", error);
                    return messages.GENERIC_ERROR;
                }
            }

            if (match.answers && match.answers.length > 0) {
                return match.answers[random.integer(0, match.answers.length - 1)];
            }

            return match;
        } else {
            return messages.NOT_EXPECTED;
        }
    }
}

export default new IntentsRunService();
