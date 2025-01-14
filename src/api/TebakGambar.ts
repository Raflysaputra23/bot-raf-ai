import axios from "axios"


const TebakGambar = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.get("https://api.siputzx.my.id/api/games/tebakgambar");
            resolve({ urlImage: data.data.img, jawaban: data.data.jawaban.trim().toLowerCase() });
        } catch(error) {
            reject(error);
        }
    })
}

export default TebakGambar;