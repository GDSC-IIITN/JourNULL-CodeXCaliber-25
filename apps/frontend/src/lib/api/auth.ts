
import { Axios } from "axios";
import { isFirstTimeLoginTodaySchema, IsFirstTimeLoginTodayResponse } from "../validation/auth.schema";

export class AuthAPI {
    private axios: Axios;

    constructor(axios: Axios) {
        this.axios = axios;
    }

    async getIsFirstTimeLoginToday(): Promise<IsFirstTimeLoginTodayResponse> {

        const response = await this.axios.get("/auth/is-first-time-login-today");
        console.log(response.data.message);
        return isFirstTimeLoginTodaySchema.parse(response.data.message);

    }

}