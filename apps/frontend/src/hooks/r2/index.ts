import { useState } from "react";

export function useR2Uploader() {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewUrl, setViewUrl] = useState<string | null>(null);
    const [fileKey, setFileKey] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string | null>(null);

    const uploadFile = async (file: File) => {
        setUploading(true);
        setError(null);
        setViewUrl(null);
        setFileKey(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.error);

            const { fileKey, mimeType } = uploadData;
            setFileKey(fileKey);

            // Save fileKey + mimeType to your DB here if needed

            const readRes = await fetch(`/api/read-url?key=${encodeURIComponent(fileKey)}`);

            const readData = await readRes.json();

            if (!readRes.ok) throw new Error(readData.error);
            setViewUrl(readData.signedUrl);
            setFileType(mimeType);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Something went wrong";
            setError(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    return { uploadFile, uploading, error, viewUrl, fileKey, fileType };
}
