// types/react-video-recorder.d.ts
declare module 'react-video-recorder' {
    import * as React from 'react';

    interface RecordingCompleteData {
        videoBlob: Blob;
        videoUrl: string;
    }

    interface VideoRecorderProps {
        /**
         * Whether the camera is on initially
         * @default undefined
         */
        isOnInitially?: boolean;
        /**
         * Whether the video is flipped (mirrored)
         * @default true
         */
        isFlipped?: boolean;
        /**
         * The MIME type for the recorded video
         * @default undefined
         */
        mimeType?: string;
        /**
         * Countdown time before recording starts (ms)
         * @default 3000
         */
        countdownTime?: number;
        /**
         * Time limit for recording (ms)
         * @default undefined
         */
        timeLimit?: number;
        /**
         * Show replay controls after recording
         * @default undefined
         */
        showReplayControls?: boolean;
        /**
         * Disable autoplay and loop for replay video
         * @default undefined
         */
        replayVideoAutoplayAndLoopOff?: boolean;
        /**
         * Media constraints for getUserMedia
         * @default { audio: true, video: true }
         */
        constraints?: MediaStreamConstraints;
        /**
         * Size of each recorded chunk (ms)
         * @default 250
         */
        chunkSize?: number;
        /**
         * Timeout for data available event (ms)
         * @default 500
         */
        dataAvailableTimeout?: number;
        /**
         * Use video input instead of camera
         * @default undefined
         */
        useVideoInput?: boolean;
        /**
         * Controls list for the video element
         * @default undefined
         */
        videoControlsList?: string;
        /**
         * Disable picture-in-picture mode
         * @default undefined
         */
        disablePictureInPicture?: boolean;
        /**
         * Render disconnected view
         * @default renderDisconnectedView
         */
        renderDisconnectedView?: () => JSX.Element;
        /**
         * Render loading view
         * @default renderLoadingView
         */
        renderLoadingView?: () => JSX.Element;
        /**
         * Render video input view
         * @default renderVideoInputView
         */
        renderVideoInputView?: () => JSX.Element;
        /**
         * Render unsupported view
         * @default renderUnsupportedView
         */
        renderUnsupportedView?: () => JSX.Element;
        /**
         * Render error view
         * @default renderErrorView
         */
        renderErrorView?: (error: Error) => JSX.Element;
        /**
         * Render actions (controls)
         * @default Actions
         */
        renderActions?: () => JSX.Element;
        /**
         * Class name for the camera view
         * @default undefined
         */
        cameraViewClassName?: string;
        /**
         * Class name for the video element
         * @default undefined
         */
        videoClassName?: string;
        /**
         * Class name for the wrapper element
         * @default undefined
         */
        wrapperClassName?: string;
        /**
         * Translation function
         * @default t
         */
        t?: (...args: any[]) => string;
        /**
         * Called when the camera is turned on
         */
        onCameraOn?: () => void;
        /**
         * Called to turn on the camera
         */
        onTurnOnCamera?: () => void;
        /**
         * Called to switch the camera
         */
        onSwitchCamera?: () => void;
        /**
         * Called to turn off the camera
         */
        onTurnOffCamera?: () => void;
        /**
         * Called when recording starts
         */
        onStartRecording?: () => void;
        /**
         * Called when recording stops
         */
        onStopRecording?: () => void;
        /**
         * Called when recording is paused
         */
        onPauseRecording?: () => void;
        /**
         * Called when recording is resumed
         */
        onResumeRecording?: () => void;
        /**
         * Called when recording is complete
         * @required
         */
        onRecordingComplete: (video: RecordingCompleteData) => void;
        /**
         * Called when video input is opened
         */
        onOpenVideoInput?: () => void;
        /**
         * Called when replaying is stopped
         */
        onStopReplaying?: () => void;
        /**
         * Called on error
         */
        onError?: (error: Error) => void;
    }

    const VideoRecorder: React.FC<VideoRecorderProps>;
    export default VideoRecorder;
}
