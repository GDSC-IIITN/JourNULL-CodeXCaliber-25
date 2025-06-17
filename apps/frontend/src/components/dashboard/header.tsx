import { signOut, useSession } from "@/lib/auth/auth-client";
import { ModeToggle } from "../theme/theme-toggle";
import { Button } from "../ui/button";
import Image from "next/image";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { ProfileDropdown } from "./profile-dropdown";
import { useTriggerStore } from "@/store/triggerStore";

export function Header({
    searchBar = true,
    profileDropdown = true,
    modeToggle = true,
}: {
    searchBar?: boolean;
    profileDropdown?: boolean;
    modeToggle?: boolean;
}) {
    const session = useSession()
    const router = useRouter();
    const { setTrigger } = useTriggerStore();
    if (session.isPending) {
        return <Skeleton className="w-full h-10" />
    }

    if (session.error) {
        return <div>Error: {session.error.message}</div>
    }
    return (
        <div className="flex top-0 right-0 z-50 gap-2 m-4">
            {searchBar && (
                <div className="flex w-full max-w-sm items-center gap-2">
                    <Input type="text" onClick={() => setTrigger(true)} placeholder="Search" />
                    <Button type="submit" variant="outline" onClick={() => setTrigger(true)}>
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </Button>
                </div>
            )}
            {profileDropdown && (
                <ProfileDropdown>
                    <Button className="rounded-full py-0 ps-0" >
                        <div className="me-0.5 flex aspect-square h-full p-1.5">
                            <Image
                                className="h-auto w-full rounded-full"
                                src={session.data?.user.image || 'https://originui.com/avatar.jpg'}
                                alt="Profile image"
                                width={24}
                                height={24}
                                aria-hidden="true"
                            />
                        </div>
                        @{session.data?.user?.name}
                    </Button>
                </ProfileDropdown>
            )}
            {modeToggle && <ModeToggle />}

        </div>

    )
}