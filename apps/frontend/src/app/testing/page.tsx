"use client";
import ImageUploader from "@/components/media-uploader";
import { DynamicMedia } from "@/components/showMedia";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useIntegrations } from "@/hooks/integrations";
import { signOut, useSession } from "@/lib/auth/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Testing() {
    const { data: session } = useSession();
    const router = useRouter();
    const { getGoogleCalendarEvents, getGooglePhotosEvents } = useIntegrations()

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

            <Card className="mt-8 p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-medium mb-2">Session Debug Info</h3>
                <pre className="text-xs overflow-auto p-2 bg-background rounded">
                    {JSON.stringify(session, null, 2)}
                </pre>
            </Card>

            <ImageUploader />
            <DynamicMedia fileKey="1747293854076_Screen Recording 2023-10-31 at 8.58.49 PM.mov" />
            {
                getGoogleCalendarEvents.data && (
                    <Card className="mt-8 p-4 bg-muted rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Google Calendar Events</h3>
                        <pre className="text-xs overflow-auto p-2 bg-background rounded">{JSON.stringify(getGoogleCalendarEvents.data, null, 2)}</pre>
                    </Card>
                )
            }
            {
                getGooglePhotosEvents.data && (
                    <Card className="mt-8 p-4 bg-muted rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Google Photos Events</h3>
                        <pre className="text-xs overflow-auto p-2 bg-background rounded">{JSON.stringify(getGooglePhotosEvents.data, null, 2)}</pre>
                    </Card>
                )
            }
            {/* <GlobalSearch /> */}
        </div>
    );
} 