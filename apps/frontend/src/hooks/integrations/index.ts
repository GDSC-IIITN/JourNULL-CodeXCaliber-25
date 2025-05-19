import api from "@/lib/api";
import { INTEGRATIONS } from "@/constants/keys";
import { useQuery } from "@tanstack/react-query";

export const useIntegrations = () => {
    const getGoogleCalendarEvents = useQuery({
        queryKey: [INTEGRATIONS.GOOGLE_CALENDAR],
        queryFn: () => api.integrations.getGoogleCalendarEvents()
    })

    const getGooglePhotosEvents = useQuery({
        queryKey: [INTEGRATIONS.GOOGLE_PHOTOS],
        queryFn: () => api.integrations.getGooglePhotosEvents()
    })

    return {
        getGoogleCalendarEvents,
        getGooglePhotosEvents
    }
}