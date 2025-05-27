'use client'
import { Particles } from "@/components/magicui/particles";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Gravity, MatterBody } from "@/components/ui/gravity";
import { HyperText } from "@/components/ui/hyper-text";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetJournals } from "@/hooks/journal";
import { JournalCard } from "@/components/journal-card";
import { Header } from "@/components/dashboard/header";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function Dashboard() {

    const router = useRouter();
    const { data: journals } = useGetJournals();
    const isMobile = useMobile();
    return (
        <div className="w-screen h-screen flex flex-col font-azeretMono overflow-y-auto bg-black">
            <Particles className="absolute top-0 left-0 w-full h-screen z-0" />
            <HyperText
                className={cn("text-9xl z-50 max-w-3/4 m-4 font-bold text-black dark:text-white", isMobile ? "text-4xl !text-center" : "text-9xl ")}
            />
            <Header />
            <Card className=" z-50 m-4 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 motion-preset-slide-right" onClick={() => router.push('/journal/new')}>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <h1>
                            New Entry
                        </h1>
                        <CirclePlus className="w-5 h-5 text-gray-500 animate-pulse" />
                    </CardTitle>
                    <CardDescription>
                        Today&apos;s Journal
                    </CardDescription>
                </CardHeader>

            </Card>

            <Card className="z-50 m-4 h-[380px]">

                <div className="flex gap-4 [--duration:40s] overflow-y-auto p-4 h-full motion-preset-slide-right ">
                    {Array.isArray(journals) && journals.map((journal) => (
                        <JournalCard key={journal.id} journal={journal} />
                    ))}
                </div>
            </Card>

        </div >

    );
}

