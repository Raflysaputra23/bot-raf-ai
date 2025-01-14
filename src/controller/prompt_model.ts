import Database from "../config/Database.js";
import { promptsCollection, promptsSchema } from "../model/prompts.js";


const getPromptModel = async () => {
    try {
        const result = new Database(promptsCollection, promptsSchema);
        const data: any = await result.FindMany();

        if(data) {
            return data?.map((item: any) => {
                const { prompt } = item;
                return { prompt };
            });
        } else {
            return "Anda adalah RafAI buatan Rafly";
        }
    } catch(error) {
        console.log(error);
    }
}

const addPromptModel = async (prompt: string) => {
    try {
        const result = new Database(promptsCollection, promptsSchema);
        await result.InsertOne({ prompt });
        return "Success add prompt";
    } catch(error) {
        console.log(error);
        return "Gagal add prompt";
    }
}

export { getPromptModel, addPromptModel };