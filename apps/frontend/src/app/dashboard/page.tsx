"use client";
import ImageUploader from "@/components/media-uploader";
import { DynamicMedia } from "@/components/showMedia";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import VideoCaptureUploader from "@/components/video-recorder";
// import { useDev } from "@/hooks/dev";
import { signOut, useSession } from "@/lib/auth/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    // Use the useSession hook to get session data including user information
    const { data: session } = useSession();
    const router = useRouter();

    // const { getHealth } = useDev()
    // console.log("Health check: ", getHealth.data)

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold mb-4 ">Dashboard</h1>
                    <p className="mb-4">Welcome to the dashboard!</p>
                </div>
                <div className="flex items-center gap-4">
                    <ModeToggle />
                    <Button onClick={() => {
                        signOut()
                            .then(() => {
                                router.push("/auth/signin");
                            })
                            .catch((error) => {
                                console.error("Error signing out:", error);
                            });

                    }}>Logout</Button>
                </div>
                <div className="flex items-center gap-4">
                    <ModeToggle />
                    <Button onClick={() => {
                        signOut()
                            .then(() => {
                                router.push("/auth/signin");
                            })
                            .catch((error) => {
                                console.error("Error signing out:", error);
                                router.push("/auth/signin");
                            });
                    }}>Logout</Button>
                </div>
            </div>

            {/* Display user information */}
            {session?.user && (
                <div className="bg-card p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
                    <div className="flex items-center gap-4">
                        {session.user.image && (
                            <Image
                                src={session.user.image}
                                alt="Profile"
                                className="w-16 h-16 rounded-full"
                                width={64}
                                height={64}
                            />
                        )}
                        <div>
                            <p className="font-medium">{session.user.name || 'User'}</p>
                            <p className="text-muted-foreground">{session.user.email}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-medium mb-2">Session Debug Info</h3>
                <pre className="text-xs overflow-auto p-2 bg-background rounded">
                    {JSON.stringify(session, null, 2)}
                </pre>
            </div>

            <ImageUploader />
            <DynamicMedia fileKey="1746708462961_Screen Recording 2023-10-31 at 8.58.49 PM.mov" />

            <VideoCaptureUploader

            />
        </div>
    );
}