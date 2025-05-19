import { z } from "zod";


export const getGooglePhotosSchema = z.object({
    mediaItems: z.array(z.object({
        id: z.string(),
        productUrl: z.string(),
        baseUrl: z.string(),
        mimeType: z.string(),
        mediaMetadata: z.object({
            creationTime: z.string(),
            width: z.string(),
            height: z.string(),
            photo: z.object({
                cameraMake: z.string().optional(),
                cameraModel: z.string().optional(),
                focalLength: z.number().optional(),
                apertureFNumber: z.number().optional(),
                isoEquivalent: z.number().optional(),
                exposureTime: z.string().optional(),
            }),
        }),
        filename: z.string(),
    })),
    nextPageToken: z.string().optional(),
})

export type GooglePhotosEventsSchema = z.infer<typeof getGooglePhotosSchema>

export const getGoogleCalendarEventsSchema = z.object({
    kind: z.string(),
    etag: z.string(),
    summary: z.string().optional(),
    description: z.string().optional(),
    updated: z.string(),
    timeZone: z.string(),
    accessRole: z.string(),
    defaultReminders: z.array(z.object({
        method: z.string(),
        minutes: z.number(),
    })).optional(),
    nextSyncToken: z.string().optional(),
    items: z.array(z.object({
        kind: z.string(),
        etag: z.string(),
        id: z.string(),
        status: z.string(),
        htmlLink: z.string(),
        created: z.string(),
        updated: z.string(),
        summary: z.string(),
        description: z.string().optional(),
        creator: z.object({
            email: z.string(),
            self: z.boolean(),
        }).optional(),
        organizer: z.object({
            email: z.string(),
            self: z.boolean(),
        }).optional(),
        start: z.object({
            date: z.string().optional(),
            dateTime: z.string().optional(),
            timeZone: z.string().optional()
        }),
        end: z.object({
            date: z.string().optional(),
            dateTime: z.string().optional(),
            timeZone: z.string().optional()
        }),
        transparency: z.string().optional(),
        iCalUID: z.string(),
        sequence: z.number(),
        reminders: z.object({
            useDefault: z.boolean(),
        }).optional(),
        eventType: z.string().optional(),
        location: z.string().optional(),
        attendees: z.array(z.object({
            email: z.string(),
            responseStatus: z.string(),
            self: z.boolean().optional()
        })).optional(),
        hangoutLink: z.string().optional(),
        conferenceData: z.object({
            createRequest: z.object({
                requestId: z.string(),
                conferenceSolutionKey: z.object({
                    type: z.string()
                })
            }).optional()
        }).optional()
    }))
})

export type GoogleCalendarEventsSchema = z.infer<typeof getGoogleCalendarEventsSchema>

