"use client";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";

export default function Dashboard() {
    // Use the useSession hook to get session data including user information
    const { data: session } = useSession();

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                    <p className="mb-4">Welcome to the dashboard!</p>
                </div>
                <ModeToggle />
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

            {/* Debug information - you can remove this in production */}
            <div className="mt-8 p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-medium mb-2">Session Debug Info</h3>
                <pre className="text-xs overflow-auto p-2 bg-background rounded">
                    {JSON.stringify(session, null, 2)}
                </pre>
            </div>
        </div>
    );
}