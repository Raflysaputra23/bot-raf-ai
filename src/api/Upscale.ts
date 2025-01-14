import axios from "axios";
import FormData from "form-data";

const Upscale = (mediaBuffer: Buffer) => {
    return new Promise( async(resolve, reject) => {
        try {
            const formData = new FormData();
            formData.append('myfile', mediaBuffer, 'image.jpg');
            formData.append('scaleRadio', '2');
            const { data } = await axios.post("https://get1.imglarger.com/api/UpscalerNew/UploadNew", formData, {
                    headers: {
                        ...formData.getHeaders()
                    }
                });
            const code = data.data.code;
            const interval = setInterval( async () => {
                const result = await axios.post("https://get1.imglarger.com/api/UpscalerNew/CheckStatusNew",{
                        code,
                        scaleRadio: 2            
                    }, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                if(result.data?.data?.status == "success") {
                    resolve(result.data.data.downloadUrls[0]);
                    clearInterval(interval);
                } 
            }, 3000);
        } catch(error) {
            reject(error);
        }
    })
}

export default Upscale;