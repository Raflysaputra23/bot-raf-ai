import axios from "axios";


const Youtube = async (url: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.get("https://p.oceansaver.in/ajax/download.php", {
                params: {
                    format: 720,
                    url,
                    api: "dfcb6d76f2f6a9894gjkege8a4ab232222",
                    copyright: 0
                }
            });
            if(!data && !data.success) throw new Error("Data not found");
            const interval = setInterval( async () => {
                const { data: data2 } = await axios.get("https://p.oceansaver.in/ajax/progress.php", {
                    params: {
                        id: data.id
                    }
                }); 
                const timeout = setTimeout(() => {
                    clearInterval(interval);
                    clearTimeout(timeout);
                    reject("Download timeout");
                }, 600_000);
                if(data2 && data2.success == 1) {
                    resolve(data2.download_url);
                    clearTimeout(timeout);
                    clearInterval(interval);
                }
            }, 3000);
        } catch(error) {
            reject("Download gagal");
        }
    });
}


export default Youtube;