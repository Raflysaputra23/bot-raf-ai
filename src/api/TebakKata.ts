import axios from "axios";


const TebakKata = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.get("https://api.lolhuman.xyz/api/tebak/siapaaku?apikey=febbXkizh");
            if(!data) throw new Error("Data not found");
            resolve({ question: data.result.question, answer: data.result.answer });
        } catch (error) {
            reject(error);
        }
    });
};

export default TebakKata;