import { Axios } from "axios";
import {
    CreateJournalInput,
    UpdateJournalInput, createJournalSchema,
    updateJournalSchema,
    journalIdSchema,
    JournalResponse,
    journalResponseSchema
} from "../validation/journal.schema";
import { MutateEntity, mutateEntitySchema } from "../validation/mutate.schema";

export class JournalAPI {
    private axios: Axios;

    constructor(axios: Axios) {
        this.axios = axios;
    }

    async getJournals(): Promise<JournalResponse> {
        const response = await this.axios.get("/journal");
        return journalResponseSchema.parse(response.data);
    }

    async getJournal(id: string): Promise<JournalResponse> {
        const validatedId = journalIdSchema.parse({ id });
        const response = await this.axios.get(`/journal/${validatedId.id}`);
        return journalResponseSchema.parse(response.data);
    }

    async createJournal(data: CreateJournalInput): Promise<MutateEntity> {
        const validatedData = createJournalSchema.parse(data);
        const response = await this.axios.post("/journal", validatedData);
        return response.data.message[0].id
    }

    async updateJournal(id: string, data: UpdateJournalInput): Promise<MutateEntity> {
        const validatedId = journalIdSchema.parse({ id });
        const validatedData = updateJournalSchema.parse(data);
        const response = await this.axios.put(`/journal/${validatedId.id}`, validatedData);
        return mutateEntitySchema.parse(response.data.message);
    }

    async deleteJournal(id: string): Promise<JournalResponse> {
        const validatedId = journalIdSchema.parse({ id });
        const response = await this.axios.delete(`/journal/${validatedId.id}`);
        return journalResponseSchema.parse(response.data);
    }
}