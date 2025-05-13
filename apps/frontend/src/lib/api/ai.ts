import { Axios } from "axios";
import {
    JournalAnalysisInput,
    JournalSuggestionsInput,
    journalAnalysisSchema,
    journalSuggestionsSchema,
} from "../validation/ai.schema";

export class AiAPI {
    private axios: Axios;

    constructor(axios: Axios) {
        this.axios = axios;
    }

    async analyzeJournal(data: JournalAnalysisInput): Promise<ReadableStream<Uint8Array>> {
        const validatedData = journalAnalysisSchema.parse(data);
        const response = await this.axios.get("/ai/analyse-journal", {
            params: validatedData,
            responseType: 'stream'
        });
        return response.data;
    }

    async aiSuggestions(data: JournalSuggestionsInput): Promise<ReadableStream<Uint8Array>> {
        const validatedData = journalSuggestionsSchema.parse(data);
        const response = await this.axios.get("/ai/suggestions", {
            params: validatedData,
            responseType: 'stream'
        });
        return response.data;
    }
}