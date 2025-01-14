import axios from "axios";


const Brat = (text: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.get(`https://brat.caliphdev.com/api/brat/`, {
                params: {
                    text
                },
                responseType: 'arraybuffer'
            });
            resolve(data);
        } catch(error) {
            reject(error);
        }
    })
}

export default Brat;