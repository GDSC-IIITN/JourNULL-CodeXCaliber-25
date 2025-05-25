export enum DEV {
    DEV_INFO = 'devInfo',
    DEV_HEALTH = 'devHealth',
}

export enum INTEGRATIONS {
    GOOGLE_CALENDAR = 'googleCalendar',
    GOOGLE_PHOTOS = 'googlePhotos',
}

export const JOURNAL = {
    JOURNALS: 'journals',
    JOURNAL: 'journal',
    CREATE_JOURNAL: 'create-journal',
    UPDATE_JOURNAL: 'update-journal',
    DELETE_JOURNAL: 'delete-journal',
} as const;

export const EMOTIONS = {
    EMOTIONS_BY_JOURNAL: 'emotions-by-journal',
    JOURNALS_BY_EMOTION: 'journals-by-emotion',
} as const;