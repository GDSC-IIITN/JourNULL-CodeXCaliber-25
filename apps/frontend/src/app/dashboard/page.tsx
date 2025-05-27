'use client'
import { Particles } from "@/components/magicui/particles";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Gravity, MatterBody } from "@/components/ui/gravity";
import { HyperText } from "@/components/ui/hyper-text";
import { useSession } from "@/lib/auth/auth-client";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Dashboard() {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const router = useRouter();

    const session = useSession()
    return (
        <div className="w-screen h-screen flex flex-col font-azeretMono overflow-hidden">
            <Particles className="absolute top-0 left-0 w-full h-screen z-0" />
            <HyperText
                className="text-9xl z-50 max-w-3/4 m-4 font-bold text-black dark:text-white "
                text={formattedDate}
            />
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
            {/* 
            <div className="pt-20 text-6xl sm:text-7xl md:text-8xl text-black w-full text-center font-calendas italic dark:text-white">
                JourNull
            </div> */}

            {/* <p className="pt-4 text-base sm:text-xl md:text-2xl text-black w-full text-center dark:text-white">
                components made with:
            </p> */}
            {/* <Gravity gravity={{ x: 0, y: 1 }} className="w-full h-[calc(100vh-200px)]">
                <MatterBody
                    matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                    x="30%"
                    y="10%"
                >
                    <div onClick={() => router.push('/dream-journal')} className="text-xl sm:text-2xl md:text-3xl bg-[#0015ff] dark:bg-[#0015ff] text-white rounded-full px-8 py-4">
                        Dream Journal 😶‍🌫️
                    </div>
                </MatterBody>
                <MatterBody
                    matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                    x="30%"
                    y="30%"
                >
                    <div className="text-xl sm:text-2xl md:text-3xl bg-[#E794DA] text-white rounded-full hover:cursor-grab px-8 py-4 ">
                        typescript
                    </div>
                </MatterBody>
                <MatterBody
                    matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                    x="40%"
                    y="20%"
                    angle={10}
                >
                    <div className="text-xl sm:text-2xl md:text-3xl bg-[#1f464d]  text-white rounded-full hover:cursor-grab px-8 py-4 ">
                        motion
                    </div>
                </MatterBody>
                <MatterBody
                    matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                    x="75%"
                    y="10%"
                >
                    <div className="text-xl sm:text-2xl md:text-3xl bg-[#ff5941]  text-white [#E794DA] rounded-full hover:cursor-grab px-8 py-4 ">
                        tailwind
                    </div>
                </MatterBody>
                <MatterBody
                    matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                    x="80%"
                    y="20%"
                >
                    <div className="text-xl sm:text-2xl md:text-3xl bg-orange-500  text-white [#E794DA] rounded-full hover:cursor-grab px-8 py-4 ">
                        drei
                    </div>
                </MatterBody>
                <MatterBody
                    matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                    x="50%"
                    y="10%"
                >
                    <div className="text-xl sm:text-2xl md:text-3xl bg-[#ffd726]  text-white [#E794DA] rounded-full hover:cursor-grab px-8 py-4 ">
                        matter-js
                    </div>
                </MatterBody>
            </Gravity> */}

            <Card className=" z-50 m-4 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 motion-preset-slide-right " onClick={() => router.push('/recents')}>
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


        </div >

    );
}

