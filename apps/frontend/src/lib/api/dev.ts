import { Axios } from "axios";

export class DevAPI {
    private axios: Axios;

    constructor(axios: Axios) {
        this.axios = axios;
    }

    async getDevInfo() {
        const response = await this.axios.get("/");
        return response.data;
    }

    async getHealth() {
        const response = await this.axios.get("/health");
        return response.data;
    }

}