import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { EmotionType } from "@/lib/validation/emotions.schema";
import { EMOTIONS } from "@/constants/keys";

export const useGetEmotionsByJournal = (journalId: string) => {
    const emotions = useQuery({
        queryKey: [EMOTIONS.EMOTIONS_BY_JOURNAL, journalId],
        queryFn: () => api.emotions.getEmotionsByJournal(journalId),
    });
    return emotions;
};

export const useGetJournalsByEmotion = (emotion: EmotionType) => {
    const journals = useQuery({
        queryKey: [EMOTIONS.JOURNALS_BY_EMOTION, emotion],
        queryFn: () => api.emotions.getJournalsByEmotion(emotion),
    });
    return journals;
}; 