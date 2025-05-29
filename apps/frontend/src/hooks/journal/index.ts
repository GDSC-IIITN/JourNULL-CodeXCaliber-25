import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateJournalInput, UpdateJournalInput } from "@/lib/validation/journal.schema";
import { JOURNAL } from "@/constants/keys";
import { toast } from "sonner";
import { Journal } from "@/lib/validation/journal.schema";

export const useGetJournals = () => {
    const journals = useQuery({
        queryKey: [JOURNAL.JOURNALS],
        queryFn: async () => {
            try {
                const response = await api.journal.getJournals();
                return response.message; // Access the message property which contains the array of journals
            } catch (error) {
                console.error("Error fetching journals:", error);
                throw error;
            }
        },
        staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
        retry: 3,
    });

    return journals;
};

export const useGetJournal = (id: string) => {
    const journal = useQuery({
        queryKey: [JOURNAL.JOURNAL, id],
        queryFn: async () => {
            try {
                return await api.journal.getJournal(id);
            } catch (error) {
                console.error(`Error fetching journal ${id}:`, error);
                throw error;
            }
        },
        staleTime: 0, // Always fetch fresh data
        retry: 3,
        enabled: !!id && id !== "new", // Only fetch if we have a valid ID
    });
    return journal;
};

export const useCreateJournal = () => {
    const queryClient = useQueryClient();
    const createJournal = useMutation({
        mutationFn: async (data: CreateJournalInput) => {
            try {
                return await api.journal.createJournal(data);
            } catch (error) {
                console.error("Error creating journal:", error);
                throw error;
            }
        },
        mutationKey: [JOURNAL.CREATE_JOURNAL],
        onMutate: async (newJournal) => {
            await queryClient.cancelQueries({ queryKey: [JOURNAL.JOURNALS] });
            const previousJournals = queryClient.getQueryData([JOURNAL.JOURNALS]);
            queryClient.setQueryData([JOURNAL.JOURNALS], (old: Journal[]) => [...(old || []), { ...newJournal, id: 'temp-id' }]);
            return { previousJournals };
        },
        onError: (err, newJournal, context) => {
            queryClient.setQueryData([JOURNAL.JOURNALS], context?.previousJournals);
            toast.error("Failed to create journal. Please try again.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [JOURNAL.JOURNALS] });
        },
        retry: 3,
    });
    return createJournal;
};

export const useUpdateJournal = (id: string) => {
    const queryClient = useQueryClient();
    const updateJournal = useMutation({
        mutationFn: async (data: UpdateJournalInput) => {
            try {
                return await api.journal.updateJournal(id, data);
            } catch (error) {
                console.error(`Error updating journal ${id}:`, error);
                throw error;
            }
        },
        mutationKey: [JOURNAL.UPDATE_JOURNAL],
        onMutate: async (updatedJournal) => {
            await queryClient.cancelQueries({ queryKey: [JOURNAL.JOURNAL, id] });
            const previousJournal = queryClient.getQueryData([JOURNAL.JOURNAL, id]);
            queryClient.setQueryData([JOURNAL.JOURNAL, id], (old: Journal) => ({
                ...old,
                ...updatedJournal,
            }));
            return { previousJournal };
        },
        onError: (err, updatedJournal, context) => {
            queryClient.setQueryData([JOURNAL.JOURNAL, id], context?.previousJournal);
            toast.error("Failed to save changes. Please try again.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [JOURNAL.JOURNAL, id] });
            queryClient.invalidateQueries({ queryKey: [JOURNAL.JOURNALS] });
        },
        retry: 3,
    });
    return updateJournal;
};

export const useDeleteJournal = (id: string) => {
    const queryClient = useQueryClient();
    const deleteJournal = useMutation({
        mutationFn: async () => {
            try {
                return await api.journal.deleteJournal(id);
            } catch (error) {
                console.error(`Error deleting journal ${id}:`, error);
                throw error;
            }
        },
        mutationKey: [JOURNAL.DELETE_JOURNAL],
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: [JOURNAL.JOURNALS] });
            const previousJournals = queryClient.getQueryData([JOURNAL.JOURNALS]);
            queryClient.setQueryData([JOURNAL.JOURNALS], (old: Journal[]) =>
                old?.filter((journal: Journal) => journal.id !== id)
            );
            return { previousJournals };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData([JOURNAL.JOURNALS], context?.previousJournals);
            toast.error("Failed to delete journal. Please try again.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [JOURNAL.JOURNALS] });
        },
        retry: 3,
    });
    return deleteJournal;
};  