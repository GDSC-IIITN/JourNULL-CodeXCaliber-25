import React from 'react';
import { DraggableCardBody } from "@/components/ui/draggable-card";

interface MediaItem {
    filename: string;
    baseUrl: string;
}

interface GooglePhotosGalleryProps {
    mediaItems: MediaItem[];
}

export const GooglePhotosGallery: React.FC<GooglePhotosGalleryProps> = ({ mediaItems }) => {
    const positionClasses = [
        "absolute top-[10%] left-[20%] rotate-[-5deg]",
        "absolute top-[40%] left-[25%] rotate-[-7deg]",
        "absolute top-[5%] left-[40%] rotate-[8deg]",
        "absolute top-[32%] left-[55%] rotate-[10deg]",
        "absolute top-[20%] right-[35%] rotate-[2deg]",
        "absolute top-[24%] left-[45%] rotate-[-7deg]",
        "absolute top-[8%] left-[30%] rotate-[4deg]",
    ];

    const transformedItems = mediaItems.map((event, index) => ({
        id: event.filename,
        title: event.filename,
        image: event.baseUrl,
        className: positionClasses[index % positionClasses.length],
    }));

    return (
        <>
            {transformedItems.map((item) => (
                <DraggableCardBody
                    key={item.id}
                    id={item.id}
                    className={item.className}
                >
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
        </>
    );
}; 