import axios from "axios";


const TikTok = async (url: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.get(`https://api.xyzen.tech/api/downloader/tiktok`, {
                params: {
                    url,
                    apikey: process.env.TIKTOK_APIKEY
                }
            });
            if(data == null) throw new Error("Data not found");
            resolve(data.url);
        } catch(error) {
            reject(error);
        }
    })
}

export default TikTok;