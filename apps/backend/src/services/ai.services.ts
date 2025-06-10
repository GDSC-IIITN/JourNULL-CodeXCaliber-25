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

        Please suggest only 1 activity that the user can do based on the journal entry.
        Keep it short and concise.
        The activity should be something that the user can do in the next 24 hours.
        The activity should be something that is not too difficult to do.
        The activity should be something that is not too expensive to do.
        The activity should be something that is not too time consuming to do.
        The activity should be something that is not too difficult to do.
        The activity should be something that is not too expensive to do.
        The activity should be something that is not too time consuming to do.
        the format should be:
        Activity: [activity]
        Reason: [reason]
        suggestionReason: [suggestionReason]
        Example:
        Activity: Go for a walk
        Reason: It's a nice day and a walk will help the user stay fit.
        suggestionReason: The user is feeling lazy and a walk will help them stay fit. (based on the journal entry)
        always use JSON format with the keys Activity, Reason, suggestionReason.
        and nothing else and not any pretext too.
        and the response should be in JSON format.
        and the response should be in the following format:
        {
            "activity": "Go for a walk",
            "reason": "It's a nice day and a walk will help the user stay fit.",
            "suggestionReason": "The user is feeling lazy and a walk will help them stay fit. (based on the journal entry)"
        }
        complete json response and nothing else.
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

        const prompt = `
        You are a helpful assistant that analyses journal entries.
        The journal entry is as follows:
        ${journal}

        These are the previous entries:
        ${previousEntries.map(entry => `${entry.title}\n${entry.content}`).join('\n')}

        Please analyse the journal entry and provide a summary of the day.
        the response should be in markdown format only.
        there should be a title for the summary.
        the title should be in bold and heading 1.
        use typography to make the summary more readable.
        use bullet points to make the summary more readable.
        use lists to make the summary more readable.
        use paragraphs to make the summary more readable.
        use bold and italic to make the summary more readable.
        use code blocks to make the summary more readable.
        use markdown to make the summary more readable.
        `
        return ai.streamText({
            prompt
        })
    }

    public static async octacat(ctx: Context, {
        context
    }: {
        context: string
    }) {
        const ai = new AI(ctx, 'groq')
        const user = ctx.get('user')

        const previousEntries = await getRelevantEntries(context, ctx)
        const prompt = `
        You are a helpful assistant (octacat) that generates a random playful text for the user.
        The text should be a random playful text for the user.
        this is user's screen text:
        ${context}
        this is user's profile data:
        ${user}
        there should be no other text than the playful text.
        it should be new everytime.
        include emojis in the text.
        include user's name in the text.
        keep it short and concise.
        suggest some random activities that the user can do
        based on the users recent journal entries:
        ${previousEntries.map(entry => `${entry.title}\n${entry.content}`).join('\n')}
        do not include any other text than the playful text.
        do not include text like here is the playful text.
        text should not be too long.
        text should be in the same language as the user's screen text.
        text should be not more than 50 words.
        `
        return ai.streamText({
            prompt
        })
    }
}