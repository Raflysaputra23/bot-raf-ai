import Database from "../config/Database.js"
import { historysCollection, historysSchema } from "../model/history.js";


const getHistoryGemini = async (senderId: string) => {
    try {
        const result = new Database(historysCollection, historysSchema);
        const data = await result.FindOne({ senderId });
        if(data) {
            const historyNew = data.history.map((item: any) => {
                const { role } = item;
                const partsOld = item.parts;
                const parts = partsOld.map((item: any) => {
                    const { text } = item;
                    return { text };
                });
                return { role, parts };
            });
            return { history: historyNew, status: true };
        } else {
            return { history: [], status: false };
        }
    } catch(error) {
        console.log(error);
        return "Gagal get history";
    }
}

const addHistoryGemini = async (senderId: string, history: any) => {
    try {
        const result = new Database(historysCollection, historysSchema);
        return await result.InsertMany({ senderId, history });
    } catch(error) {
        console.log(error);
        return "Gagal add history";
    }
}

const updateHistoryGemini = async (senderId: string, history: any) => {
    try {
        const result = new Database(historysCollection, historysSchema);
        return await result.UpdateMany({ senderId }, { $push: { history: { $each: history } } });
    } catch(error) {
        console.log(error);
        return "Gagal update history";
    }
}

const delHistoryGemini = async (senderId: string) => {
    try {
        const result = new Database(historysCollection, historysSchema);
        await result.DeleteOne({ senderId });
        return "Success delete history";
    } catch(error) {
        console.log(error);
        return "Gagal delete history";
    }
}

export { getHistoryGemini, addHistoryGemini, updateHistoryGemini, delHistoryGemini };

