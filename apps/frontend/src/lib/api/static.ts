import { Axios } from 'axios';
import { Ghibli, GhibliSchema } from '../validation/ghibli.schema';

export class StaticAPI {
    private axios: Axios;

    constructor(axios: Axios) {
        this.axios = axios;
    }

    async getGhibliImage(query: string): Promise<Ghibli> {
        try {
            const response = await this.axios.get(`/static/ghibli/${query}`);
            return GhibliSchema.parse(response.data.message);
        } catch (error) {
            console.error(`Error getting ghibli image: ${error}`);
            throw error;
        }
    }
}
