"use client"
import { Particles } from "@/components/magicui/particles";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import {
    DraggableCardBody,
    DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { useIntegrations } from "@/hooks/integrations";
import { debounce } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useCreateJournal, useUpdateJournal } from "@/hooks/journal";
export default function RecentsPage() {
    const { getGooglePhotosEvents } = useIntegrations()
    const { data: googlePhotosEvents, isLoading, error } = getGooglePhotosEvents
    const [journalId, setJournalId] = useState<string>("")
    const [content, setContent] = useState<string>("")

    //on content change, i want to save the content to the database with debounce which i have already created in the utils folder and use the createJournal and updateJournal hooks
    const { mutate: createJournal } = useCreateJournal()
    const { mutate: updateJournal } = useUpdateJournal(journalId)

    const debouncedSaveContent = debounce((content: string) => {
        if (journalId) {
            updateJournal({ content, title: "Recents" })
        } else {
            createJournal({ content, title: "Recents", category: "journal" })
        }
    }, 1000)

    useEffect(() => {
        const date = new Date()
        const html = `<h1>${date.toLocaleDateString()}</h1><p>${content}</p>`
        setContent(html)
    }, [])

    useEffect(() => {
        debouncedSaveContent(content)
    }, [content])

    const clearCardPositions = () => {
        if (googlePhotosEvents?.mediaItems) {
            googlePhotosEvents.mediaItems.forEach(item => {
                localStorage.removeItem(`card-position-${item.filename}`);
            });
        }
    };

    const transformedGooglePhotosEvents = googlePhotosEvents?.mediaItems.map((event, index) => {
        const positionClasses = [
            "absolute top-[10%] left-[20%] rotate-[-5deg]",
            "absolute top-[40%] left-[25%] rotate-[-7deg]",
            "absolute top-[5%] left-[40%] rotate-[8deg]",
            "absolute top-[32%] left-[55%] rotate-[10deg]",
            "absolute top-[20%] right-[35%] rotate-[2deg]",
            "absolute top-[24%] left-[45%] rotate-[-7deg]",
            "absolute top-[8%] left-[30%] rotate-[4deg]",
        ];

        const className = positionClasses[index % positionClasses.length];

        return {
            id: event.filename,
            title: event.filename,
            image: event.baseUrl,
            className,
        };
    })

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    if (!googlePhotosEvents) {
        return <div>No events found</div>
    }

    return (
        <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
            <Particles className="absolute top-0 left-0 w-screen h-screen z-0" />
            <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-neutral-400/20 md:text-4xl dark:text-neutral-800/30">
                How was your day?
            </p>
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="flex justify-end gap-2 p-4">
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

            {transformedGooglePhotosEvents?.map((item) => (
                <DraggableCardBody
                    key={item.id}
                    id={item.id}
                    className={item.className}>
                    <img
                        src={item.image}
                        alt={item.title}
                        className="pointer-events-none relative z-10 h-80 w-80 object-cover"
                    />
                    <h3 className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
                        {item.title}
                    </h3>
                </DraggableCardBody>
            ))}
        </DraggableCardContainer>
    );
}
