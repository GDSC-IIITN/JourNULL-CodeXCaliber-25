import { CustomDrizzleClient } from "@/lib/db";
import { journals } from "@/lib/db/schema";
import { AIClient } from "@/lib/ai";
import { Env } from '@/types/bindings';
import { getRelevantEntries } from "@/utils";
import { eq, or } from "drizzle-orm";
import { Context } from "hono";

export class JournalService {
  public static readonly analyzeJournalEntry = async (journalText: string, env: Env) => {
    const aiClient = new AIClient(env);
    try {
      return await aiClient.analyzeJournal(journalText);
    } catch (error) {
      console.error('Failed to analyze journal entry:', error);
      return {
        error: 'Failed to analyze journal entry',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public static readonly getAIResponse = async (prompt: string, env: Env): Promise<string> => {
    const aiClient = new AIClient(env);
    return aiClient.generateText(prompt);
  }

  public static readonly streamAIResponse = (prompt: string, env: Env): Response => {
    const aiClient = new AIClient(env);
    return aiClient.streamText(prompt);
  }

  public static readonly chatWithAI = async (messages: Array<{ role: 'user' | 'system' | 'assistant', content: string }>, env: Env): Promise<string> => {
    const aiClient = new AIClient(env);
    return aiClient.chatCompletion(messages);
  }

  public static readonly getAIsuggestions = async (current_entry: string, ctx: Context): Promise<string> => {
    const aiClient = new AIClient(ctx.env);
    try {
      const relevantEntries = await getRelevantEntries(current_entry, ctx);
      let prompt = `Based on my current journal entry, please provide me with some suggestions or insights:\n\n${current_entry}`;

      if (relevantEntries.ids.length > 0) {
        const drizzleClient = new CustomDrizzleClient({
          url: ctx.env.DATABASE_URL,
          authToken: ctx.env.DATABASE_AUTH_TOKEN,
        });

        const appDB = await drizzleClient.client();
        const collection = await appDB
          .select({ id: journals.id, content: journals.content })
          .from(journals)
          .where(or(...relevantEntries.ids.map(id => eq(journals.id, Number(id)))))
          .execute();

        const relevantEntriesText = collection.map(entry => entry.content).join('\n\n');
        prompt = `Here are some of my previous journal entries:\n\n${relevantEntriesText}\n\nBased on these entries, please provide me with some suggestions or insights related to my current entry:\n\n${current_entry}`;
      }

      return JournalService.chatWithAI([{
        role: 'user',
        content: prompt,
      }], ctx.env);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);

      return aiClient.chatCompletion([{
        role: 'user',
        content: `Based on my current journal entry, please provide me with some suggestions or insights:\n\n${current_entry} \n\n
        the answers must be short and concise, must contain only few lines`,
      }]);
    }
  }
}
