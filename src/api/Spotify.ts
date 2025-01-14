import axios from "axios";

const Spotify = (query: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.get(`https://spotifyapi.caliphdev.com/api/search/tracks`, {
                params: {
                    q: `${encodeURIComponent(query)}`
                }
            });
            if(data == null) throw new Error("Data not found");
            resolve(data);
        } catch(error) {
            reject(error);
        }
    })
}

export default Spotify;