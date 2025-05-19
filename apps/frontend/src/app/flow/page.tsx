import { authClient } from "@/lib/auth/auth-client";
import { headers } from "next/headers";

export default async function FlowPage() {

    //log headers
    // const headersList = await headers()

    const session = await authClient.getSession({
        fetchOptions: {
            headers: await headers()
        }
    })

    // const cookieStore = await cookies()


    const accessToken = await authClient.getAccessToken({
        providerId: "google",
        fetchOptions: {
            headers: await headers()
        }
    })

    if (!session) {
        return <div>Not authenticated</div>
    }
    return (
        <div>
            <h1>Welcome {session.data?.user.name}</h1>
            <h2>Your access token is: {accessToken.data?.accessToken}</h2>
        </div>
    )
}