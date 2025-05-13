import { useEffect } from "react";
import { useState } from "react";

export default function AiStream(stream: ReadableStream) {
    const [text, setText] = useState("");

    useEffect(() => {
        const reader = stream.getReader();
        const read = async () => {
            const result = await reader.read();
            if (result.done) {
                return;
            }
            setText(result.value);
            read();
        }
        read();
    }, [stream]);

    return <div>{text}</div>;
}