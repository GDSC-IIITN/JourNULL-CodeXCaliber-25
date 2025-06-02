// {
//     "id": "abcdef1234567890",
//         "url": "https://www.ghibli.jp/gallery/totoro001.jpg",
//             "film_code": "totoro",
//                 "film_name": "totoro",
//                     "image_number": "001"
// }

import { z } from "zod";

export const GhibliSchema = z.object({
    id: z.string(),
    url: z.string(),
    film_code: z.string(),
    film_name: z.string(),
    image_number: z.string(),
});

export type Ghibli = z.infer<typeof GhibliSchema>;