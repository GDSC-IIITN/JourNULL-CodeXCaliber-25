"use client"
import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Skeleton } from "@/components/ui/skeleton";
import { GlobalSearchResponse, Journal } from "@/lib/validation/journal.schema";
import { useRouter } from "next/navigation";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@radix-ui/react-dialog";
import Fuse from "fuse.js";
import { useGetJournals } from "@/hooks/journal";
import { useTriggerStore } from "@/store/triggerStore";
import { useRecentSearchStore } from "@/store/searchStore";


export default function GlobalSearch(
) {
    const { recentSearch } = useRecentSearchStore();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<GlobalSearchResponse[]>(recentSearch);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { trigger, setTrigger } = useTriggerStore();
    const { data: localJournals } = useGetJournals();


    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const controller = new AbortController();

        const delay = setTimeout(async () => {
            setLoading(true);

            fetch(`http://localhost:8787/search?q=${encodeURIComponent(query)}`, {
                credentials: "include",
                signal: controller.signal,

            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    if (Array.isArray(data) && data.length > 0) {
                        setResults(data);
                    } else if (Array.isArray(localJournals) && localJournals.length > 0) {
                        // Fallback to fuzzy search on local journals
                        const fuse = new Fuse(localJournals, {
                            keys: ["title", "content"],
                            threshold: 0.4,
                        });
                        const fuzzyResults = fuse.search(query).map(result => result.item);
                        // Map to GlobalSearchResponse shape
                        setResults(fuzzyResults.map(journal => ({
                            id: journal.id,
                            title: journal.title ?? null,
                            content: journal.content ?? null,
                            category: journal.category,
                            userId: journal.userId,
                            createdAt: (journal as Journal).createdAt ?? 0,
                            updatedAt: (journal as Journal).updatedAt ?? 0,
                            isDeleted: (journal as Journal).isDeleted ?? 0,
                            isArchived: (journal as Journal).isArchived ?? 0,
                            isStarred: (journal as Journal).isStarred ?? 0,
                            isDraft: (journal as Journal).isDraft ?? 0,
                        }) as GlobalSearchResponse));
                    } else {
                        setResults([]);
                    }
                })
                .catch((err) => {
                    if (err.name !== "AbortError") {
                        // Fallback to fuzzy search on local journals if fetch fails
                        if (Array.isArray(localJournals) && localJournals.length > 0) {
                            const fuse = new Fuse(localJournals, {
                                keys: ["title", "content"],
                                threshold: 0.4,
                            });
                            const fuzzyResults = fuse.search(query).map(result => result.item);
                            setResults(fuzzyResults.map(journal => ({
                                id: journal.id,
                                title: journal.title ?? null,
                                content: journal.content ?? null,
                                category: journal.category,
                                userId: journal.userId,
                                createdAt: (journal as Journal).createdAt ?? 0,
                                updatedAt: (journal as Journal).updatedAt ?? 0,
                                isDeleted: (journal as Journal).isDeleted ?? 0,
                                isArchived: (journal as Journal).isArchived ?? 0,
                                isStarred: (journal as Journal).isStarred ?? 0,
                                isDraft: (journal as Journal).isDraft ?? 0,
                            }) as GlobalSearchResponse));
                        } else {
                            setResults([]);
                        }
                    }
                })
                .finally(() => setLoading(false));
        }, 250);

        return () => {
            controller.abort();
            clearTimeout(delay);
        };
    }, [query, localJournals]);


    // Toggle the menu when ⌘K is pressed
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setTrigger(!trigger)
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [setTrigger, trigger])


    return (
        // should be in center of the screen
        <Command.Dialog
            open={trigger}
            onOpenChange={setTrigger}
            label="Global Search"
            className="fixed inset-0 z-50 flex motion-preset-slide-right transition-all duration-300 ease-in-out items-center justify-center w-full h-full bg-transparent"
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    router.push(`/journal/${results[0].id}`);
                }
                if (e.key === "Escape") {
                    e.preventDefault();
                    setTrigger(false);
                }
            }}
            onBlur={() => {
                setTrigger(false);
            }}
        >
            <div className="w-[600px] rounded-xl border bg-background shadow-xl">
                <VisuallyHidden>
                    <DialogTitle>Global Search</DialogTitle>
                </VisuallyHidden>
                <Command.Input
                    value={query}
                    onValueChange={setQuery}
                    placeholder="Search journals...                                                                                             (⌘K)"
                    className="text-base w-full outline-none p-3"
                />


                <Command.List className="max-h-[400px] overflow-y-auto h-full">
                    {loading && (
                        <div className="p-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={`skeleton-${i}`} className="p-2 mb-2">
                                    <Skeleton className="h-4 w-full mb-1" />
                                    <Skeleton className="h-3 w-3/4" />
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <>
                            {results.map((journal) => (
                                <Command.Item
                                    key={journal.id}
                                    value={`${journal.title} ${journal.content || ''}`}
                                    className="hover:cursor-pointer px-4 py-3 hover:bg-accent rounded-md mx-2 my-1"
                                    onSelect={() => {
                                        router.push(`/journal/${journal.id}`);
                                    }}
                                    onClick={() => {
                                        router.push(`/journal/${journal.id}`);
                                    }}
                                >
                                    <div className="w-full hover:cursor-pointer" onClick={() => {
                                        router.push(`/journal/${journal.id}`);
                                    }}>
                                        <p className="font-medium text-sm mb-1">{journal.title}</p>
                                        <p dangerouslySetInnerHTML={{ __html: journal.content?.slice(0, 100) + (journal.content && journal.content.length > 100 ? "..." : "") }} className="text-muted-foreground text-xs truncate" />
                                    </div>
                                </Command.Item>
                            ))}
                        </>
                    )}

                    {!loading && results.length === 0 && query.trim() && (
                        <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                            No results found for &quot;{query}&quot;.
                        </Command.Empty>
                    )}

                    {!loading && !query.trim() && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            Start typing to search journals...
                        </div>
                    )}
                </Command.List>
            </div>
        </Command.Dialog>
    );
}