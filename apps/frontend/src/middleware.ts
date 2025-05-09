import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    // if (!sessionCookie) {
    //     return NextResponse.redirect(new URL("/auth/signin", request.url));
    // }

    if (request.nextUrl.pathname.startsWith("/auth")) {
        const session = getSessionCookie(request);
        if (session) {
            // If the user is already authenticated, redirect to the dashboard
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        // If the user is not authenticated, allow access to the auth page
        return NextResponse.next();
    }

    if (request.nextUrl.pathname.startsWith("/dashboard")) {
        // Check if the user is authenticated
        if (!sessionCookie) {
            // If not authenticated, redirect to the sign-in page
            return NextResponse.redirect(new URL("/auth/signin", request.url));
        }
        // If authenticated, allow access to the dashboard
        return NextResponse.next();
    }

    return NextResponse.next();
}




export const config = {
    matcher: ["/dashboard",
        "/dashboard/:path*",
        "/auth/:path*", // Apply middleware to all auth routes
        "/profile/:path*", // Apply middleware to all profile routes
        "/settings/:path*", // Apply middleware to all settings routes
    ], // Specify the routes the middleware applies to
};