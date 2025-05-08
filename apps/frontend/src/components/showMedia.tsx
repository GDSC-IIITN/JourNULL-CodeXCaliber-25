import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

export function DynamicMedia({ fileKey }: { fileKey: string }) {
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<"image" | "video" | "audio" | null>(null);
    const [progress, setProgress] = useState(0);
    const [objectUrl, setObjectUrl] = useState<string | null>(null);

    useEffect(() => {
        async function loadMedia() {
            try {
                const res = await axios.get(`/api/media/${fileKey}`, {
                    responseType: 'blob',
                    onDownloadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
                        setProgress(percentCompleted);
                    },
                });

                const contentType = res.headers['content-type'] ?? "";

                if (contentType.startsWith("image/")) {
                    setMediaType("image");
                } else if (contentType.startsWith("video/")) {
                    setMediaType("video");
                } else if (contentType.startsWith("audio/")) {
                    setMediaType("audio");
                }

                const newObjectUrl = URL.createObjectURL(res.data);
                setObjectUrl(newObjectUrl);
                setMediaUrl(newObjectUrl);
            } catch (error) {
                console.error("Error loading media:", error);
                setMediaUrl(null);
                setMediaType(null);
            }
        }

        loadMedia();

        // Clean up
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [fileKey]);

    if (!mediaUrl || !mediaType) {
        return (
            <div className="w-full max-w-md mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-center mt-2 text-sm text-gray-600">Loading... {progress}%</p>
            </div>
        );
    }

    if (mediaType === "image") return <Image src={mediaUrl} alt="uploaded media" width={500} height={500} />;
    if (mediaType === "video") return <video src={mediaUrl} controls width="500" />;
    if (mediaType === "audio") return <audio src={mediaUrl} controls />;

    return <p>Unsupported media type</p>;
}
