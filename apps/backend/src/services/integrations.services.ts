import { createAuth } from "@/lib/auth"
import { Context } from "hono"

export class IntegrationsService {
    static async getGoogleCalendarEvents(ctx: Context) {
        const auth = await createAuth(ctx.env)
        const account = await auth.api.getAccessToken({
            body: {
                providerId: 'google',
                userId: ctx.get('user')?.id
            }
        })

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${today.toISOString()}&timeMax=${tomorrow.toISOString()}`, {
            headers: {
                Authorization: `Bearer ${account.accessToken || ''}`
            }
        })

        return response.json()
    }

    static async getGooglePhotosEvents(ctx: Context) {
        const auth = await createAuth(ctx.env)
        const account = await auth.api.getAccessToken({
            body: {
                providerId: 'google',
                userId: ctx.get('user')?.id
            }
        })


        // Get today's date range
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const filters = {
            dateFilter: {
                ranges: [{
                    startDate: {
                        year: today.getFullYear(),
                        month: today.getMonth() + 1,
                        day: today.getDate()
                    },
                    endDate: {
                        year: tomorrow.getFullYear(),
                        month: tomorrow.getMonth() + 1,
                        day: tomorrow.getDate()
                    }
                }]
            }
        }

        const response = await fetch(`https://photoslibrary.googleapis.com/v1/mediaItems:search`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${account.accessToken || ''}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pageSize: 5
            })
        })


        return response.json()
    }
}