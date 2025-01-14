import axios from "axios";
import FormData from "form-data";


const FileUpload = async (mediaBuffer: Buffer) => {
    return new Promise(async (resolve, reject) => {
        try {
            const formData = new FormData();
            formData.append('reqtype', "fileupload");
            formData.append('fileToUpload', mediaBuffer, 'image.jpg');
            const { data } = await axios.post("https://catbox.moe/user/api.php", formData, {
                headers: {
                    ...formData.getHeaders()
                }
            });
            if(!data) throw new Error("Data not found");
            resolve(data); 
        } catch(error) {
            reject(error);
        }       
    })
}

export default FileUpload;