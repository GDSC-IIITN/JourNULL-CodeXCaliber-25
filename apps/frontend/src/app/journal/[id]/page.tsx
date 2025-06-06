"use client"
import { Particles } from "@/components/magicui/particles";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { DraggableCardContainer } from "@/components/ui/draggable-card";
import { useIntegrations } from "@/hooks/integrations";
import { useCreateJournal, useGetJournal, useUpdateJournal } from "@/hooks/journal";
import { useJournalSave } from "@/hooks/journal/useJournalSave";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { SaveStatus } from "@/components/journal/SaveStatus";
import { GooglePhotosGallery } from "@/components/journal/GooglePhotosGallery";
import { useEffect, useMemo } from "react";

export default function RecentsPage() {
    const router = useRouter();
    const { id } = useParams();
    const { mutate: createJournal, isPending: isCreating } = useCreateJournal();
    const { mutate: updateJournal } = useUpdateJournal(id as string);
    const { data: journal, isLoading: isJournalLoading, error: journalError } = useGetJournal(id as string);

    // Memoize the initial content to prevent unnecessary re-renders
    const initialContent = useMemo(() => {
        if (!journal?.message) return "";

        if (Array.isArray(journal.message)) {
            return journal.message[0]?.content || "";
        }

        return journal.message.content || "";
    }, [journal, id]);
    const { content, setContent, saveStatus } = useJournalSave({
        updateJournal: updateJournal,
        initialContent,
    });

    const { getGooglePhotosEvents } = useIntegrations();
    const { data: googlePhotosEvents, isLoading, error } = getGooglePhotosEvents;

    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Handle new journal creation
    useEffect(() => {
        if (!id || id === "new") {
            createJournal(
                { content: "start writing here", title: date, category: "journal", tags: [] },
                {
                    onSuccess: (response) => {
                        console.log("Create journal response:", response);
                        router.replace(`/journal/${response}`);
                    },
                    onError: (error) => {
                        console.error("Error creating journal:", error);
                        toast.error("Failed to create journal. Please try again.");
                    }
                }
            );
        }
    }, [id, createJournal, router, date]);

    // Show loading state when creating a new journal
    if (isCreating || (!id || id === "new")) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="text-lg">Creating new journal...</div>
        </div>;
    }

    // Handle Google Photos card positions
    const clearCardPositions = () => {
        if (googlePhotosEvents?.mediaItems) {
            googlePhotosEvents.mediaItems.forEach(item => {
                localStorage.removeItem(`card-position-${item.filename}`);
            });
        }
    };

    if (isJournalLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="text-lg">Loading journal...</div>
        </div>;
    }

    if (journalError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-lg text-red-500">Error loading journal. Please try again.</div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!googlePhotosEvents) {
        return <div>No events found</div>;
    }

    return (
        <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
            <Particles className="absolute top-0 left-0 w-screen h-screen z-0" />
            <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-neutral-400/20 md:text-4xl dark:text-neutral-800/30">
                How was your day?
            </p>
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="flex justify-end gap-2 p-4">
                    <SaveStatus status={saveStatus} />
                    <button
                        onClick={clearCardPositions}
                        className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                        Reset Positions
                    </button>
                    <ModeToggle />
                </div>
                <SimpleEditor content={content} setContent={setContent} />
            </div>

            <GooglePhotosGallery
                mediaItems={googlePhotosEvents.mediaItems}
            />
        </DraggableCardContainer>
    );
}
