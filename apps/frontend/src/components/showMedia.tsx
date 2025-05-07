import { useEffect, useState } from "react";

export function DynamicMedia({ fileKey }: { fileKey: string }) {
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<"image" | "video" | "audio" | null>(null);

    useEffect(() => {
        async function loadMedia() {
            try {
                const res = await fetch(`/api/media/${fileKey}`);

                if (!res.ok) {
                    console.error("Failed to load media");
                    return;
                }

                const contentType = res.headers.get("Content-Type") ?? "";

                if (contentType.startsWith("image/")) {
                    setMediaType("image");
                } else if (contentType.startsWith("video/")) {
                    setMediaType("video");
                } else if (contentType.startsWith("audio/")) {
                    setMediaType("audio");
                }

                const blob = await res.blob();
                const objectUrl = URL.createObjectURL(blob);
                setMediaUrl(objectUrl);
            } catch (error) {
                console.error("Error loading media:", error);
            }
        }

        loadMedia();

        // Clean up
        return () => {
            if (mediaUrl) {
                URL.revokeObjectURL(mediaUrl);
            }
        };
    }, [fileKey]);

    if (!mediaUrl || !mediaType) return <p>Loading...</p>;

    if (mediaType === "image") return <img src={mediaUrl} alt="uploaded media" />;
    if (mediaType === "video") return <video src={mediaUrl} controls width="500" />;
    if (mediaType === "audio") return <audio src={mediaUrl} controls />;

    return <p>Unsupported media type</p>;
}
