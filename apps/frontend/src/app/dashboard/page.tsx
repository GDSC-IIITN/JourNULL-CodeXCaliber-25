"use client";
import { useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function Dashboard() {
    // Use the useSession hook to get session data including user information
    const { data: session } = useSession();

    // If not authenticated, redirect to login
    if (status === "unauthenticated") {
        redirect("/");
    }

    // Show loading state while checking authentication
    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    // Now you can access the user data from the session
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="mb-4">Welcome to the dashboard!</p>

            {/* Display user information */}
            {session?.user && (
                <div className="bg-card p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
                    <div className="flex items-center gap-4">
                        {session.user.image && (
                            <img
                                src={session.user.image}
                                alt="Profile"
                                className="w-16 h-16 rounded-full"
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