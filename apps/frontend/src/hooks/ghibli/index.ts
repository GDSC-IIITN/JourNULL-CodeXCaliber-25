import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useGhibli = (query: string) => {
    return useQuery({
        queryKey: ["ghibli", query],
        queryFn: () => api.static.getGhibliImage(query),
    });
};