
import { DEV } from '@/constants/keys';
import api from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useDev = () => {
    // const queryClient = useQueryClient()
    const getHealth = useQuery({
        queryKey: [DEV.DEV_HEALTH],
        queryFn: () => api.dev.getHealth()
    })

    return {
        getHealth
    }
}