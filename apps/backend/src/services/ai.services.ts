import { getRelevantEntries } from "@/utils"
import { Context } from "hono"
import { AI } from "@/lib/ai"

export class AIService {

    public static async suggestions(ctx: Context, {
        journal
    }: {
        journal: string
    }) {
        const ai = new AI(ctx, 'groq')
        const prompt = `
        You are a helpful assistant that suggests activities based on the journal entry.
        The journal entry is as follows:
        ${journal}

        Please suggest 3 activities that the user can do based on the journal entry.
        `
        return ai.streamText({
            prompt
        })
    }



    public static async analyseJournal(ctx: Context, {
        journal
    }: {
        journal: string
    }) {
        const ai = new AI(ctx, 'groq')
        const previousEntries = await getRelevantEntries(journal, ctx)
        console.log(previousEntries)

        const prompt = `
        You are a helpful assistant that analyses journal entries.
        The journal entry is as follows:
        ${journal}

        These are the previous entries:
        ${previousEntries.map(entry => `${entry.title}\n${entry.content}`).join('\n')}

        Please analyse the journal entry and provide a summary of the day.
        `
        return ai.streamText({
            prompt
        })
    }

}