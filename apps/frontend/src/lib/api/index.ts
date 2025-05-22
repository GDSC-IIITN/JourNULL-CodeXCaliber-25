import axios, { Axios, AxiosError } from 'axios';
import { env } from '../config/env';
import { DevAPI } from './dev';
import { authClient } from '../auth/auth-client';
import { redirect } from 'next/navigation';
import { JournalAPI } from './journal';
import { AiAPI } from './ai';
import { IntegrationsAPI } from './integrations';
import { AuthAPI } from './auth';

class ApiSdk {
    private readonly mainInstance: Axios;

    dev: DevAPI;
    journal: JournalAPI;
    ai: AiAPI;
    integrations: IntegrationsAPI;
    auth: AuthAPI;
    constructor() {
        this.mainInstance = this.createAxios(env.NEXT_PUBLIC_API_URL);
        this.dev = new DevAPI(this.mainInstance)
        this.journal = new JournalAPI(this.mainInstance)
        this.ai = new AiAPI(this.mainInstance)
        this.integrations = new IntegrationsAPI(this.mainInstance)
        this.auth = new AuthAPI(this.mainInstance)
    }

    private createAxios(baseURL: string): Axios {
        const ax = axios.create({
            baseURL,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            adapter: 'fetch',
            fetchOptions: { cache: 'no-store' },
        });

        ax.interceptors.response.use(
            (res) => res,
            async (error: AxiosError) => {
                if (error.response?.status === 401) {
                    const session = authClient.getSession()
                    if (!session) {
                        authClient.signOut()
                        return redirect('/auth/login')
                    }
                    return Promise.reject(error)
                }
                return Promise.reject(error)
            }
        )
        return ax;
    }

    getInstances() {
        return { main: this.mainInstance };
    }
}

const api = new ApiSdk();
export default api;

