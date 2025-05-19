"use client"
import {
    DraggableCardBody,
    DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { useIntegrations } from "@/hooks/integrations";

export default function RecentsPage() {

    const { getGooglePhotosEvents } = useIntegrations()
    const { data: googlePhotosEvents, isLoading, error } = getGooglePhotosEvents


    const transformedGooglePhotosEvents = googlePhotosEvents?.mediaItems.map((event, index) => {
        // Predefined Tailwind classes for better spread
        const positionClasses = [
            "absolute top-[10%] left-[20%] rotate-[-5deg]",
            "absolute top-[40%] left-[25%] rotate-[-7deg]",
            "absolute top-[5%] left-[40%] rotate-[8deg]",
            "absolute top-[32%] left-[55%] rotate-[10deg]",
            "absolute top-[20%] right-[35%] rotate-[2deg]",
            "absolute top-[24%] left-[45%] rotate-[-7deg]",
            "absolute top-[8%] left-[30%] rotate-[4deg]",
        ];

        // Cycle through classes if we have more items than predefined classes
        const className = positionClasses[index % positionClasses.length];

        return {
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
            <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-neutral-400 md:text-4xl dark:text-neutral-800">
                Whats going on today?
            </p>

            {transformedGooglePhotosEvents?.map((item) => (
                <DraggableCardBody
                    key={item.title}
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
