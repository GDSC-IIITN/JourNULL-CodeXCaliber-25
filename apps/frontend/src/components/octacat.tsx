"use client"
import { ComicBubble } from "./comic-bubble";
import { useOctacat } from "@/hooks/ai";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MessageLoading } from "./threedot-loader";
import { playSound } from "@/lib/utils";
import { unescapeMarkdown } from "@/lib/utils";

export const useRandomEmoji = (interval: number = 1000) => {
    const [emoji, setEmoji] = useState<string>('');
    useEffect(() => {
        const timeout = setInterval(() => {
            const emojis = ['😊', '😢', '😠', '😨', '😖', '😮', '😐', '😰', '😔', '😫', '😓', '🤷‍♂️'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            setEmoji(randomEmoji);
        }, interval);
        return () => clearInterval(timeout);
    }, [interval]);
    return emoji;
}

export default function Octacat() {
    const { data: octacatData, trigger, isLoading } = useOctacat();
    const emoji = useRandomEmoji();
    const [data, setData] = useState('');  // this is the data that is displayed in the comic bubble
    useEffect(() => {
        if (octacatData) {
            setData(octacatData);
        }
    }, [octacatData]);

    useEffect(() => {
        // trigger(document.body.innerText);
        const interval = setInterval(() => {
            trigger(document.body.innerText);
            console.log('triggering')
        }, 200000);
        return () => clearInterval(interval);
    }, [trigger]);

    // i want to fade away the comic bubble text after some time if it is not clicked
    useEffect(() => {
        if (data) {
            const interval = setInterval(() => {
                setData('');
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [data]);

    return (
        <div className="fixed bottom-4 right-4 flex flex-col items-end z-[100]">
            <div className="mb-1 mr-24 max-w-[400px]">
                <ComicBubble hover control noSelection className="m-0" onBlur={() => {
                    console.log('blur')
                }} onClick={() => {
                    trigger(document.body.innerText);
                    playSound();
                }}>
                    <ReactMarkdown>
                        {data ? unescapeMarkdown(data) : ''}
                    </ReactMarkdown>
                    {isLoading && <div className="flex items-center gap-2"><MessageLoading /> <span className="text-sm">{emoji}</span></div>}
                </ComicBubble>
            </div>
            <img src="https://utfs.io/f/aMMSb4aTvgRAD3XhUF45BaPf63czwTuqO9SoUJKy8NgbYik0" alt="logo" width={100} height={100} />
        </div>
    )
}