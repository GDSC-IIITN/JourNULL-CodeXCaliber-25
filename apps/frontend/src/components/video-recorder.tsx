"use client";

import { useR2Uploader } from "@/hooks/r2";
import { useCallback, useEffect, useState } from "react";
import VideoRecorder, { RecordingCompleteData } from "react-video-recorder";
import React from "react";
import { XIcon, UploadIcon, RecordIcon } from "@/components/tiptap-icons";

interface VideoRecorderModalProps {
    onUploadComplete?: (viewUrl: string) => void;
    onClose: () => void;
}

export default function VideoRecorderModal({ onUploadComplete, onClose }: VideoRecorderModalProps) {
    const { uploadFile, uploading, error, viewUrl } = useR2Uploader();
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

    const handleRecordingComplete = useCallback(
        (videoData: RecordingCompleteData) => {
            setIsRecording(false);
            if (timerInterval) {
                clearInterval(timerInterval);
                setTimerInterval(null);
            }
            setRecordingTime(0);

            const videoBlob = videoData;
            const file = new File([videoBlob], `video_${Date.now()}.webm`, {
                type: "video/webm",
            });
            uploadFile(file);
        },
        [uploadFile, timerInterval]
    );

    useEffect(() => {
        if (viewUrl && onUploadComplete) {
            onUploadComplete(viewUrl);
        }
    }, [viewUrl, onUploadComplete]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        };
    }, [timerInterval]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-[720px] max-w-[90vw] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Record Video
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <XIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Video Preview */}
                <div className="relative bg-black aspect-video">
                    <VideoRecorder
                        onRecordingComplete={handleRecordingComplete}
                        isOnInitially={false}
                        videoClassName="w-full h-full object-cover"
                        wrapperClassName="w-full h-full"
                        cameraViewClassName="w-full h-full bg-black"
                        renderVideoInputView={() => (
                            <div className="relative w-full h-full">
                                {isRecording && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                        <RecordIcon className="w-4 h-4 animate-pulse" />
                                        {formatTime(recordingTime)}
                                    </div>
                                )}
                            </div>
                        )}
                    />
                </div>

                {/* Status Messages */}
                <div className="p-4 space-y-2">
                    {uploading && (
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <UploadIcon className="w-5 h-5 animate-bounce" />
                            <span>Uploading your video...</span>
                        </div>
                    )}
                    {error && (
                        <div className="flex items-center gap-2 text-red-500">
                            <XIcon className="w-5 h-5" />
                            <span>Error: {error}</span>
                        </div>
                    )}
                    {viewUrl && (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <UploadIcon className="w-5 h-5" />
                            <span>Video uploaded successfully!</span>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click the record button to start recording. The video will be automatically uploaded when you stop recording.
                    </p>
                </div>
            </div>
        </div>
    );
}
