// components/MediaUploader.tsx
"use client";

import { useR2Uploader } from "@/hooks/r2";
import Image from "next/image";


export default function MediaUploader() {
    const { uploadFile, uploading, error, viewUrl, fileKey, fileType } = useR2Uploader();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
    };

    return (
        <div>
            <input type="file" accept="image/*,audio/*,video/*" onChange={handleChange} />
            {uploading && <p>Uploading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {viewUrl && (
                <>
                    <p>Preview:</p>
                    {fileType?.startsWith("image/") && <Image src={viewUrl} alt="Uploaded media" width={500} height={500} />}
                    {fileType?.startsWith("video/") && <video src={viewUrl} controls width="500" />}
                    {fileType?.startsWith("audio/") && <audio src={viewUrl} controls />}
                    <p>File Key: {fileKey}</p>
                    <p>File Type: {fileType}</p>
                    <p>View URL: {viewUrl}</p>
                </>
            )}
        </div>
    );
}
