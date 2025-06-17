"use client"
import { ComicBubble } from "./comic-bubble";
import { useOctacat } from "@/hooks/ai";
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { MessageLoading } from "./threedot-loader";
import { playSound } from "@/lib/utils";
import { unescapeMarkdown } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
    const router = useRouter();
    const { data: octacatData, trigger, isLoading } = useOctacat();
    const emoji = useRandomEmoji();
    const [data, setData] = useState('');  // this is the data that is displayed in the comic bubble
    const [visible, setVisible] = useState(true); // Start as visible on first render
    const [fade, setFade] = useState(false); // controls fade-out animation
    const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (octacatData) {
            setData(octacatData);
            setVisible(true);
            setFade(false);
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

    // Fade away the comic bubble and octacat after some time if not clicked
    useEffect(() => {
        if (data && visible) {
            if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
            fadeTimeoutRef.current = setTimeout(() => {
                setFade(true);
                setTimeout(() => {
                    setVisible(false);
                    setData('');
                }, 500); // match fade-out duration
            }, 10000);
        }
        return () => {
            if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
        };
    }, [data, visible]);

    // Handler for blur (clicking away from the comic bubble)
    const handleBlur = () => {
        setFade(true);
        setTimeout(() => {
            setVisible(false);
            setData('');
        }, 500); // match fade-out duration
    };

    // Only render if visible or fading out
    if (!visible && !fade) return null;

    return (
        <div className={`fixed bottom-4 right-4 flex flex-col items-end z-[100] transition-opacity duration-500 ${fade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="mb-1 mr-24 max-w-[400px]">
                <ComicBubble hover control noSelection className="m-0" onBlur={handleBlur} onClick={() => {
                    trigger(document.body.innerText);
                    // playSound();
                }}>
                    <ReactMarkdown>
                        {data ? unescapeMarkdown(data) : ''}
                    </ReactMarkdown>
                    {isLoading && <div className="flex items-center gap-2"><MessageLoading /> <span className="text-sm">{emoji}</span></div>}
                </ComicBubble>
            </div>
            <img onClick={() => {
                router.push('/profile');
            }} src="https://utfs.io/f/aMMSb4aTvgRAD3XhUF45BaPf63czwTuqO9SoUJKy8NgbYik0" alt="logo" width={100} height={100}
                className="motion-preset-oscillate motion-duration-2000"
            />
        </div>
    )
}