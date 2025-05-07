"use client";
import { useR2Uploader } from "@/hooks/r2";
import { useCallback } from "react";
import VideoRecorder, { RecordingCompleteData } from "react-video-recorder";

export default function VideoCaptureUploader() {
    const { uploadFile, uploading, error, viewUrl, fileKey, fileType } = useR2Uploader();

    const handleRecordingComplete = useCallback(
        (videoData: RecordingCompleteData) => {
            // React Video Recorder returns a blob in the videoBlob Property
            const videoBlob = videoData.videoBlob;
            const file = new File([videoBlob], `video_${Date.now()}.webm`, {
                type: "video/webm",
            });
            uploadFile(file);
        },
        [uploadFile]
    );

    return (
        <div className="p-2">
            <div className="w-[640px] h-[480px] relative bg-black">
                <VideoRecorder
                    onRecordingComplete={handleRecordingComplete}
                    isOnInitially={false}
                    videoClassName="w-full h-full object-cover"
                    wrapperClassName="w-full h-full"
                />
            </div>
            {uploading && <p>Uploading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {viewUrl && fileType && (
                <div className="mt-4">
                    <p>File Key: {fileKey}</p>
                    {fileType.startsWith("video/") && (
                        <video controls src={viewUrl} className="max-w-md" />
                    )}
                </div>
            )}
        </div>
    );
}
