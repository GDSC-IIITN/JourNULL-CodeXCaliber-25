import api from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export const useAuth = () => {
    const isFirstTimeLoginToday = useQuery({
        queryKey: ['auth', 'isFirstTimeLoginToday'],
        queryFn: () => api.auth.getIsFirstTimeLoginToday()
    })

    return {
        isFirstTimeLoginToday
    }
}