import axios from "axios";


const SusunKata = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.get("https://api.lolhuman.xyz/api/tebak/susunkata?apikey=febbXkizh");
            if(!data) throw new Error("Data not found");
            resolve({ question: data.result.pertanyaan, answer: data.result.jawaban });
        } catch (error) {
            reject(error);
        }
    });
};

export default SusunKata;