import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuShortcut, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Bot, MoreVertical, Settings, Share, Trash2 } from "lucide-react";
import { useDeleteJournal } from "@/hooks/journal";

export function JournalDropdown({
    journalId
}: {
    journalId: string;
}) {
    const deleteJournal = useDeleteJournal();

    const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        deleteJournal.mutate(journalId);
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {/* <Button variant="outline" className="rounded-full"> */}
                <MoreVertical className="w-6 h-6 text-7xl font-bold hover:text-zinc-500 dark:hover:text-zinc-400" />
                {/* </Button> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-zinc-100 dark:bg-zinc-900" align="start">
                <DropdownMenuLabel>My Journal</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>

                        <a href={`/journal/${journalId}`}>
                            <Bot className="w-4 h-4" />
                        </a>
                        AI

                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <a href={`/journal/${journalId}`}>
                            <Settings className="w-4 h-4" />
                        </a>
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <a href={`/journal/${journalId}`}>
                            <Share className="w-4 h-4" />
                        </a>
                        Share
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 hover:bg-red-500/10 hover:text-red-500" onClick={handleDelete}>
                    Delete
                    <DropdownMenuShortcut>
                        <Trash2 className="w-4 h-4" />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
