import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateJournalInput, UpdateJournalInput } from "@/lib/validation/journal.schema";
import { JOURNAL } from "@/constants/keys";

export const useGetJournals = () => {
    const journals = useQuery({
        queryKey: [JOURNAL.JOURNALS],
        queryFn: () => api.journal.getJournals(),
    });

    return journals;
};

export const useGetJournal = (id: string) => {
    const journal = useQuery({
        queryKey: [JOURNAL.JOURNAL, id],
        queryFn: () => api.journal.getJournal(id),
    });
    return journal;
};

export const useCreateJournal = () => {
    const queryClient = useQueryClient();
    const createJournal = useMutation({
        mutationFn: (data: CreateJournalInput) => api.journal.createJournal(data),
        mutationKey: [JOURNAL.CREATE_JOURNAL],
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [JOURNAL.JOURNALS] });
        }
    });
    return createJournal;
};

export const useUpdateJournal = (id: string) => {
    const queryClient = useQueryClient();
    const updateJournal = useMutation({
        mutationFn: (data: UpdateJournalInput) => api.journal.updateJournal(id, data),
        mutationKey: [JOURNAL.UPDATE_JOURNAL],
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [JOURNAL.JOURNALS] });
        }
    }
    );
    return updateJournal;
};

export const useDeleteJournal = (id: string) => {
    const queryClient = useQueryClient();
    const deleteJournal = useMutation({
        mutationFn: () => api.journal.deleteJournal(id),
        mutationKey: [JOURNAL.DELETE_JOURNAL],
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [JOURNAL.JOURNALS] });
        }
    });
    return deleteJournal;
};  