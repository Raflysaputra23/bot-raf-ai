import { downloadMediaMessage } from "@whiskeysockets/baileys"
import Pino from 'pino';
import sharp from "sharp";

const logger: any = Pino({
    level: 'debug', 
    transport: {
        target: 'pino-pretty', 
        options: {
            colorize: true, 
        },
    },
});
const downloadMedia = async (media: any, RafAI: any, type: string = "file") => {
    const buffer = await downloadMediaMessage(media, "buffer",{},{ logger, reuploadRequest: RafAI.updateMediaMessage });
    if(type === "image") {
        return await sharp(buffer).toFormat("webp").toBuffer();
    } else {
        return buffer;
    }
}

export default downloadMedia;