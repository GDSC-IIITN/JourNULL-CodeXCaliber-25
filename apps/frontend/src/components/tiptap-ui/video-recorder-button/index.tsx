import * as React from "react"
import { useEditor } from "@tiptap/react"
import { Button } from "@/components/tiptap-ui-primitive/button"
import { VideoRecorderIcon } from "@/components/tiptap-icons/video-recorder-icon"
import VideoCaptureUploader from "@/components/video-recorder"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function VideoRecorderButton() {
    const editor = useEditor()
    const [isOpen, setIsOpen] = React.useState(false)

    const handleVideoUpload = React.useCallback((viewUrl: string) => {
        if (editor?.isActive && viewUrl) {
            editor.commands.setVideo(viewUrl)
            setIsOpen(false)
        }
    }, [editor])

    const button = React.useMemo(() => (
        <Button data-style="ghost">
            <VideoRecorderIcon className="tiptap-button-icon" />
        </Button>
    ), [])

    if (!editor?.isActive || !editor.schema || !editor.schema.nodes.doc) {
        return null
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                {button}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <VideoCaptureUploader onUploadComplete={handleVideoUpload} onClose={() => setIsOpen(false)} />
            </PopoverContent>
        </Popover>
    )
} 