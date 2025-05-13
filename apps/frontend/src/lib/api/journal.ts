import { Axios } from "axios";
import {
    CreateJournalInput,
    UpdateJournalInput, createJournalSchema,
    updateJournalSchema,
    journalIdSchema,
    JournalResponse
} from "../validation/journal.schema";

export class JournalAPI {
    private axios: Axios;

    constructor(axios: Axios) {
        this.axios = axios;
    }

    async getJournals(): Promise<JournalResponse> {
        const response = await this.axios.get("/journal");
        return response.data;
    }

    async getJournal(id: string): Promise<JournalResponse> {
        const validatedId = journalIdSchema.parse({ id });
        const response = await this.axios.get(`/journal/${validatedId.id}`);
        return response.data;
    }

    async createJournal(data: CreateJournalInput): Promise<JournalResponse> {
        const validatedData = createJournalSchema.parse(data);
        const response = await this.axios.post("/journal", validatedData);
        return response.data;
    }

    async updateJournal(id: string, data: UpdateJournalInput): Promise<JournalResponse> {
        const validatedId = journalIdSchema.parse({ id });
        const validatedData = updateJournalSchema.parse(data);
        const response = await this.axios.put(`/journal/${validatedId.id}`, validatedData);
        return response.data;
    }

    async deleteJournal(id: string): Promise<JournalResponse> {
        const validatedId = journalIdSchema.parse({ id });
        const response = await this.axios.delete(`/journal/${validatedId.id}`);
        return response.data;
    }
}