import { Axios } from "axios";
import {
    EmotionType,
    journalIdSchema,
    EmotionsResponse,
    JournalsByEmotionResponse,
    emotionsResponseSchema,
    journalsByEmotionResponseSchema
} from "../validation/emotions.schema";

export class EmotionsAPI {
    private axios: Axios;

    constructor(axios: Axios) {
        this.axios = axios;
    }

    async getEmotionsByJournal(journalId: string): Promise<EmotionsResponse> {
        const validatedId = journalIdSchema.parse({ journalId });
        const response = await this.axios.get(`/emotions/journal/${validatedId.journalId}`);
        return emotionsResponseSchema.parse(response.data);
    }

    async getJournalsByEmotion(emotion: EmotionType): Promise<JournalsByEmotionResponse> {
        const response = await this.axios.get(`/emotions/type/${emotion}`);
        return journalsByEmotionResponseSchema.parse(response.data);
    }
} 