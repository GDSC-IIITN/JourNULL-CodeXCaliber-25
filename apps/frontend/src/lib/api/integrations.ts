import { Axios } from "axios";
import { getGoogleCalendarEventsSchema, getGooglePhotosSchema, GoogleCalendarEventsSchema, GooglePhotosEventsSchema } from "../validation/integrations.schema";

export class IntegrationsAPI {
    private axios: Axios;

    constructor(axios: Axios) {
        this.axios = axios;
    }

    async getGoogleCalendarEvents(): Promise<GoogleCalendarEventsSchema> {
        const response = await this.axios.get("/integrations/google-calendar");
        return getGoogleCalendarEventsSchema.parse(response.data.message);
    }

    async getGooglePhotosEvents(): Promise<GooglePhotosEventsSchema> {
        const response = await this.axios.get("/integrations/google-photos");
        return getGooglePhotosSchema.parse(response.data.message);
    }
}