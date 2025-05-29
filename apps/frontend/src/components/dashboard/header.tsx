import { useSession } from "@/lib/auth/auth-client";
import { ModeToggle } from "../theme/theme-toggle";
import { Button } from "../ui/button";
import Image from "next/image";

export function Header() {
    const session = useSession()
    return (
        <div className="flex absolute top-0 right-0 z-50 gap-2 m-4">
            <Button className="rounded-full py-0 ps-0">
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
            <ModeToggle />
        </div>
    )
}