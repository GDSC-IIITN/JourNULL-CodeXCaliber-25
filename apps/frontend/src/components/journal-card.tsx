import { useGhibli } from "@/hooks/ghibli";
import { Journal } from "@/lib/validation/journal.schema";
import { Tilt } from "@/components/tilt";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface JournalCardProps {
    journal: Journal;
}

export function JournalCard({ journal }: JournalCardProps) {
    const { data: ghibliData, isLoading: isGhibliLoading } = useGhibli(journal.id);
    const router = useRouter();

    return (
        <Tilt rotationFactor={10} isRevese key={journal.id}>
            <div
                style={{
                    borderRadius: '12px',
                }}
                onClick={() => {
                    router.push(`/journal/${journal.id}`);
                }}
                className='flex hover:bg-zinc-100 dark:hover:bg-zinc-800 w-[270px] h-[300px] flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900 cursor-pointer'
            >
                {isGhibliLoading ? (
                    <Skeleton className="h-48 w-full" />
                ) : (
                    <Image
                        src={ghibliData?.url || 'https://www.ghibli.jp/images/common/logo.png'}
                        loading="lazy"
                        alt={ghibliData?.film_name || 'Default image'}
                        className='h-48 w-full object-cover'
                        width={270}
                        height={300}
                    />
                )}

                <div className='p-2'>
                    <h1 className='font-mono leading-snug text-zinc-950 dark:text-zinc-50'>
                        {journal.title || 'Untitled'}
                    </h1>
                    <p className='text-zinc-700 dark:text-zinc-400 line-clamp-2'>
                        {journal.content ? <div dangerouslySetInnerHTML={{ __html: `${journal.content.substring(0, 100)}...` }} /> : 'No content yet'}
                    </p>
                </div>
            </div>
        </Tilt>
    );
} 