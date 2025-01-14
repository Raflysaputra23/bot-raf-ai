import axios from "axios";
import FormData from "form-data";


const extrakVideoToAudio = async (videoBuffer: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const formData = new FormData();
            formData.append("files[]", videoBuffer, "video.mkv");
            formData.append("token", "null");
            const { data } = await axios.post("https://api.hitpaw.com/app/uploadVideo", formData,{
                headers: {
                    ...formData.getHeaders(),
                    Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbm9ueW1vdXMiOnRydWUsInVzZXJfaWQiOiJmdUhTdEg5dW9lQTFJbDJvMUhtMXdHNDEiLCJ1c2VyX3Nlc3Npb25faWQiOiIiLCJ1c2VyX3dvcmtfZGlyIjoiZnVIU3RIOXVvZUExSWwybzFIbTF3RzQxIiwiZXhwIjozODg0MTQ2MjAwLCJpYXQiOjE3MzY2NjI1NTN9.xWUCzAhcwisF_1Bs_Gwk41yO-2V7ADh-_WUjEP0KkGA"
                }
            });
            if(data == null) throw new Error("Data not found");
            resolve(data.data.response_file[0]);
        } catch(error) {
            reject(error);
        }
    })
}

export default extrakVideoToAudio;