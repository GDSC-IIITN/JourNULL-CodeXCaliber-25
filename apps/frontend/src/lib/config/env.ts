import { createEnv } from '@t3-oss/env-nextjs';
import { defaultEmptyString } from '../validation/base.schema';

export const env = createEnv({
    client: {
        NEXT_PUBLIC_URL: defaultEmptyString,
        NEXT_PUBLIC_API_URL: defaultEmptyString,
        NEXT_PUBLIC_AUTH_BASE_URL: defaultEmptyString,
    },
    server: {
        R2_ACCESS_KEY_ID: defaultEmptyString,
        R2_SECRET_ACCESS_KEY: defaultEmptyString,
        R2_BUCKET_NAME: defaultEmptyString,
        R2_ACCOUNT_ID: defaultEmptyString,
    },
    runtimeEnv: {
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_AUTH_BASE_URL: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
        R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
        R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
        R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
        R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    },
});


