import axios, { Axios, AxiosError } from 'axios';
import { env } from '../config/env';
import { DevAPI } from './dev';
import { authClient } from '../auth/auth-client';
import { redirect } from 'next/navigation';

class ApiSdk {
    private readonly mainInstance: Axios;

    dev: DevAPI;

    constructor() {
        this.mainInstance = this.createAxios(env.NEXT_PUBLIC_API_URL);
        this.dev = new DevAPI(this.mainInstance)
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

