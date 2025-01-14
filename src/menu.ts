import { blokir, aksesGrup, addAksesGrup, deleteAksesGrup, addBlokir, deleteBlokir, updateAksesGrup } from "./utils/akses.js";
import { addOwner, deleteOwner, owner } from "./utils/owner.js";
import downloadMedia from "./utils/downloadMedia.js";
// import axios from "axios";
import sharp from "sharp";
import { addSilent, getSilent, deleteSilent } from "./utils/silent.js";
import { helpAdmin, helpUser } from "./utils/help.js";
import GeminiAI from "./api/GeminiAI.js";
import TebakGambar from "./api/TebakGambar.js";
import { addSkorTebakGambar, addTebakGambar, delTebakGambar, getSkorTebakGambar, getTebakGambar } from "./utils/tebakGambar.js";
import { downloadContentFromMessage, generateMessageIDV2 } from "@whiskeysockets/baileys";
import Spotify from "./api/Spotify.js";
import { addSpotify, getSpotify } from "./utils/spotify.js";
import TikTok from "./api/TikTok.js";
import Instagram from "./api/Instagram.js";
import Upscale from "./api/Upscale.js";
import getSource from "./utils/code.js";
import Brat from "./api/Brat.js";
import FileUpload from "./api/FileUpload.js";
import Facebook from "./api/Facebook.js";
import { delHistoryGemini } from "./controller/gemini_model.js";
import { addPromptModel } from "./controller/prompt_model.js";
import { randomBytes } from "crypto";
import extractAudioFromVideoStream from "./utils/extrakVideoToAudio.js";
import Youtube from "./api/Youtube.js";
import TebakKata from "./api/TebakKata.js";
import { addSkorTebakKata, addTebakKata, deleteTebakKata, getSkorTebakKata, getTebakKata } from "./utils/tebakKata.js";
import { addSkorSusunKata, addSusunKata, deleteSusunKata, getSkorSusunKata, getSusunKata } from "./utils/susunKata.js";


interface MenuProps {
    command: string;
    prefix: string;
    argument: string | null;
    type: string;
    m: any
}

interface OptionProps {
    sender: string;
    senderId: string;
    senderName: string;
    mentionId: string | string[];
    quoted: any;
    extensiPerson: string;
    extensiGrup: string;
    media: any;
}



const option = (m: any) => {
    const options: OptionProps =  {
        sender: m.messages[0].key.remoteJid,
        quoted: m.messages[0],
        senderId: m.messages[0].key.participant || m.messages[0].key.remoteJid,
        senderName: m.messages[0].pushName || "Anonymous",
        mentionId: m.messages[0].message?.extendedTextMessage?.contextInfo?.mentionedJid,
        extensiPerson: "@s.whatsapp.net",
        extensiGrup: "@g.us",
        media: m.messages[0],
    }
    return options;
}

const menu = async ({ command, prefix, argument, type, m } : MenuProps, RafAI: any) => {
    const { sender, senderId, senderName, mentionId, quoted, extensiPerson, extensiGrup, media  } = option(m);
    if(!senderId.startsWith("628")) return false;
    interface AksesGrup {
        idGrup: string;
        admins: string[];
        izinMember: boolean | string;
    }
    
    // HAK AKSES BOT GRUP
    const cekAksesGrup: AksesGrup = aksesGrup().find((grup: AksesGrup) => grup?.idGrup === sender);
    if(cekAksesGrup) {
        if(!cekAksesGrup.izinMember && !cekAksesGrup.admins.includes(senderId) && !owner().some((owner: any) => owner?.senderId === senderId)) {
            return false;
        }
    }

    // HAK AKSES BOT PERSON
    if(blokir().includes(senderId)) {
        return false;
    }

    switch(command) {
        // ADMIN
        case "addowner": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "Nomor tidak boleh kosong" });
                    break;
                };

                if(owner().some((owner: any) => owner?.senderId === senderId)) {
                    const [ nomor = false, name = false ] = argument?.split(" ");
                    if(nomor && name) {
                        const nohp: string = nomor?.startsWith("0") ? `${nomor.replace("0", "62")}${extensiPerson}` : `${nomor}${extensiPerson}`;
                        const response: string = addOwner(nohp, name);
                        await RafAI.sendMessage(sender, { text: response });
                    } else {
                        await RafAI.sendMessage(sender, { text: "Masukkan nomor dan nama" });
                    }
                } else {
                    await RafAI.sendMessage(sender, { text: "Anda bukan owner" });
                }
            } catch(error) {
                console.log(error);
            }

            break;
        };
        case "delowner": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "Nomor tidak boleh kosong" });
                    break;
                };

                if(owner().some((owner: any) => owner?.senderId === senderId)) {
                    const nohp: string = argument?.startsWith("0") ? `${argument.replace("0", "62")}${extensiPerson}` : `${argument}${extensiPerson}`;
                    const response: string = deleteOwner(nohp);
                    await RafAI.sendMessage(sender, { text: response });
                } else {
                    await RafAI.sendMessage(sender, { text: "Anda bukan owner" });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        };
        case "addag": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "admin / idGrup tidak boleh kosong" });
                    break;
                }
                
                if(owner().some((owner: any) => owner?.senderId === senderId) || cekAksesGrup?.admins?.includes(senderId)) {
                    const [ idGrup = false, izinMember = true, ...admins ] = argument?.split(" ");
                    if(admins && idGrup) {
                        const nohp: string[] = admins.map((nomor: string) => nomor.startsWith("62") ? `${nomor}${extensiGrup}` : `${nomor.replace("0", "62")}${extensiPerson}`);
                        const response: string = addAksesGrup(idGrup, nohp, izinMember);
                        await RafAI.sendMessage(sender, { text: response });
                    } else {
                        await RafAI.sendMessage(sender, { text: "Owner / ID Grup tidak boleh kosong" });
                    }
                } else {
                    await RafAI.sendMessage(sender, { text: "Anda bukan owner / admin grup" });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "delag": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "idGrup tidak boleh kosong" });
                    break;
                }

                if(owner().some((owner: any) => owner?.senderId === senderId) || cekAksesGrup?.admins?.includes(senderId)) {
                    const [ idGrup = false, ...admins ] = argument.split(" ");
                    if(idGrup) {
                        const nohp: string[] = admins.map((nomor: string) => nomor.startsWith("62") ? `${nomor}${extensiGrup}` : `${nomor.replace("0", "62")}${extensiPerson}`);
                        const response = deleteAksesGrup(idGrup, nohp);
                        await RafAI.sendMessage(sender, { text: response });
                    } else {
                        await RafAI.sendMessage(sender, { text: "ID Grup tidak boleh kosong" });
                    }
                } else {
                    await RafAI.sendMessage(sender, { text: "Anda bukan owner / admin grup" });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "updateag": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "idGrup tidak boleh kosong" });
                    break;
                }

                
                if(owner().some((owner: any) => owner?.senderId === senderId) || cekAksesGrup?.admins?.includes(senderId)) {
                    const [ idGrup = false, izinMember = true, ...admins ] = argument?.split(" ");
                    if(idGrup) {
                        const nohp = admins ? admins.map((nomor: string) => nomor.startsWith("62") ? `${nomor}${extensiGrup}` : `${nomor.replace("0", "62")}${extensiPerson}`) : [];
                        const response = updateAksesGrup(idGrup, nohp, izinMember);
                        await RafAI.sendMessage(sender, { text: response });
                    } else {
                        await RafAI.sendMessage(sender, { text: "Owner / idGrup tidak boleh kosong" });
                    }
                } else {
                    await RafAI.sendMessage(sender, { text: "Anda bukan owner / admin grup" });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "getag": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(owner().some((owner: any) => owner?.senderId === senderId)) {
                    const response = aksesGrup();
                    let template = 
`
┏━━━━ AKSES GRUP ━━━⬣  
`
                    ;
                    response.forEach((grup: { idGrup: string; admins: string[]; izinMember: boolean; }) => {
                        template += 
`
┣⬣ ID Grup: ${grup.idGrup}
┣⬣ Admin: ${grup.admins.map((nomor: string) => nomor.split("@")[0]).join(", ")}
┣⬣ Izin Member: ${grup.izinMember ? "✅" : "❌"}
`
                    });
                    template += 
`
┗━━━━━━━━━━━━━━━━━━━━━⬣
`;
                    await RafAI.sendMessage(sender, { text: template }, { quoted });
                } else {
                    await RafAI.sendMessage(sender, { text: "Anda bukan owner" }, { quoted });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "addblokir": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "Nomor tidak boleh kosong" });
                    break;
                };

                if(owner().some((owner: any) => owner?.senderId === senderId)) {
                    const nohp = argument?.startsWith("0") ? `${argument.replace("0", "62")}${extensiPerson}` : `${argument}${extensiPerson}`;
                    const response = addBlokir(nohp);
                    await RafAI.sendMessage(sender, { text: response });
                } else {
                    await RafAI.sendMessage(sender, { text: "Anda bukan owner" });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "delblokir": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "Nomor tidak boleh kosong" });
                    break;
                };

                if(owner().some((owner: any) => owner?.senderId === senderId)) {
                    const nohp = argument?.startsWith("0") ? `${argument.replace("0", "62")}${extensiPerson}` : `${argument}${extensiPerson}`;
                    const response = deleteBlokir(nohp);
                    await RafAI.sendMessage(sender, { text: response });
                } else {
                    await RafAI.sendMessage(sender, { text: "Anda bukan owner" });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "getblokir": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(owner().some((owner: any) => owner?.senderId === senderId)) {
                    const response = blokir();
                    let template = 
`
┏━━━━ DAFTAR BLOKIR ━━━⬣
`
                   response.forEach((nomor: string) => {
                       template += 
`
┣⬣ Nomor WA: ${nomor.split("@")[0]}
`
                   });
                   template += 
`
┗━━━━━━━━━━━━━━━⬣
`;
                    await RafAI.sendMessage(sender, { text: template }, { quoted }); 
                } else {
                    await RafAI.sendMessage(sender, { text: "Anda bukan owner" }, { quoted });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "updatestatus": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "Status tidak boleh kosong" });
                    break;
                };

                if(owner().some((owner: any) => owner?.senderId === senderId)) {
                    await RafAI.updateProfileStatus(argument);
                    await RafAI.sendMessage(sender, { text: "Status berhasil diubah" });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "updatename": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "Nama tidak boleh kosong" });
                    break;
                };

                if(owner().some((owner: any) => owner?.senderId === senderId)) {
                    await RafAI.updateProfileName(argument)
                    await RafAI.sendMessage(sender, { text: "Nama berhasil diubah" });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "updateprofil": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                const buffer = await downloadMedia(media, RafAI, "image");

                if(buffer && owner().some((owner: any) => owner?.senderId === senderId)) {
                    const url = await FileUpload(buffer);
                    await RafAI.updateProfilePicture("6288276322525@s.whatsapp.net", { url });
                    await RafAI.sendMessage(sender, { text: "Profil berhasil diubah" });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "addprompt": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "Nama tidak boleh kosong" });
                    break;
                };

                if(owner().some((owner: any) => owner.senderId === senderId)) {
                    const response: string = await addPromptModel(argument);
                    await RafAI.sendMessage(sender, { text: `*${response}*` }, { quoted });
                }
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: `*${error}*`}, { quoted });
            }
            break;
        }

        // USER
        case "sticker": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                const buffer = await downloadMedia(media, RafAI, "image");
                await RafAI.sendMessage(sender, { sticker: buffer, caption: "*Sticker By RafAI*" },{ quoted });
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Mohon Sertakan Gambar*" }, { quoted });
            }
            break;
        }
        case "owner": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                const owners = owner();
                let template: string = 
`
┏━━━━ OWNER ━━━⬣  
`;
                owners.forEach((owner: any) => {
                    template += 
`
┣⊱ *Nama* : ${owner.senderName}
┣⊱ *Nomor* : ${owner.senderId}
`
                });
                template += 
`
┗━━━━━━━━━━━━━⬣
`
                await RafAI.sendMessage(sender, { text: template }, { quoted }); 
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "gif": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                const buffer = await downloadMedia(media, RafAI, "video");
                await RafAI.sendMessage(sender, { gifPlayback: true, video: buffer, caption: "*Gif By RafAI*", ptv: false }, { quoted });  
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Mohon Sertakan Gambar*" }, { quoted });
            }
            break;
        }
        case "help": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(owner().some((owner: any) => owner?.senderId === senderId)) {
                    await RafAI.sendMessage(sender, { text: helpAdmin }, { quoted });
                } 
                await RafAI.sendMessage(sender, { text: helpUser }, { quoted });
                
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "getpicture": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "Nomor tidak boleh kosong" });
                    break;
                };

                let id: string;
                if(argument?.startsWith("0") || argument?.startsWith("62")) {
                    id = argument?.startsWith("0") ? `${argument.replace("0", "62")}${extensiPerson}` : `${argument}${extensiPerson}`;   
                } else {
                    id = `${argument}${extensiGrup}`;
                }

                if(!owner().some((owner: any) => owner?.senderId === id)) {
                    const ppUrl = await RafAI.profilePictureUrl(id, 'image');
                    // const { data } = await axios.get(ppUrl, { responseType: 'arraybuffer' });
                    // const buffer = Buffer.from(data, 'binary');
                    // const image = await sharp(buffer).toFormat("webp").toBuffer();
                    await RafAI.sendMessage(sender, { image: { url: ppUrl }, caption: "*Profile Picture By RafAI*" }, { quoted });
                } else {
                    await RafAI.sendMessage(sender, { text: "*Maaf saya tidak dapat mengambil gambar owner*" }, { quoted });
                }
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Maaf nomor / grup tidak ditemukan*" }, { quoted });
            }
            break;
        }
        case "blok": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "Nomor tidak boleh kosong" });
                    break;
                };

                const nohp = argument?.startsWith("0") ? `${argument.replace("0", "62")}${extensiPerson}` : `${argument}${extensiPerson}`;
                await RafAI.updateBlockStatus(nohp, "block");
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Maaf nomor tidak ditemukan*" }, { quoted });
            }
            break;
        }
        case "unblok": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "Nomor tidak boleh kosong" });
                    break;
                };

                const nohp = argument?.startsWith("0") ? `${argument.replace("0", "62")}${extensiPerson}` : `${argument}${extensiPerson}`;
                await RafAI.updateBlockStatus(nohp, "unblock");
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Maaf nomor tidak ditemukan*" }, { quoted });
            }
            break;
        }
        case "chatai": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "*Mohon masukkan pertanyaan!*" });
                    break;
                }

                if(type == "imageMessage" || type == "documentWithCaptionMessage" || type == "videoMessage") {
                    const buffer = await downloadMedia(media, RafAI, "file");
                    const mimeType = type == "imageMessage" ? m.messages[0].message?.imageMessage?.mimetype : 
                                     type == "videoMessage" ? m.messages[0].message?.videoMessage?.mimetype : 
                                     type == "documentWithCaptionMessage" ? m.messages[0].message?.documentWithCaptionMessage?.message?.documentMessage?.mimetype : false;
                    if(mimeType) {
                        if(mimeType.includes("video")) {
                            await RafAI.sendMessage(sender,{ text: "*Sedang menganalisis video, mohon tunggu beberapa saat...*" }, { quoted });
                        } else if(mimeType.includes("image")) {
                            await RafAI.sendMessage(sender,{ text: "*Sedang menganalisis gambar*" }, { quoted });
                        } else {
                            await RafAI.sendMessage(sender,{ text: "*Sedang menganalisis dokumen, mohon tunggu beberapa saat...*" }, { quoted });
                        }
                        await RafAI.sendPresenceUpdate('composing', sender); 
                        const answer = await GeminiAI(argument, senderId, { buffer, mimeType });
                        if(!sender.includes("628")) {
                            await RafAI.sendMessage(sender, { text: answer }, { quoted });
                        } else {
                            const RAFAI = [
                                { attrs: { biz_bot: '1' }, tag: 'bot' },
                                { attrs: {}, tag: 'biz' }
                            ];
                            
                            const responAI = {
                                conversation: answer,
                                messageContextInfo: {
                                  messageSecret: randomBytes(32),
                                  supportPayload: {
                                    "version": 1,
                                    "is_ai_message": true,
                                    "should_show_system_message": true,
                                    "ticket_id": 1669945700536053
                                  }
                                }
                            }
                            await RafAI.relayMessage(sender, responAI, { messageld: generateMessageIDV2(RafAI.user?.id), additionalNodes: RAFAI});
                        }
                    } else {
                        await RafAI.sendMessage(sender, { text: "*Maaf file yang valid harus berupa gambar atau dokumen pdf*" }, { quoted });
                    }
                } else {
                    const answer = await GeminiAI(argument, senderId);
                    if(!sender.includes("628")) {
                        await RafAI.sendMessage(sender, { text: answer }, { quoted });
                    } else {
                        const RAFAI = [
                            { attrs: { biz_bot: '1' }, tag: 'bot' },
                            { attrs: {}, tag: 'biz' }
                        ];
                        
                        const responAI = {
                            conversation: answer,
                            messageContextInfo: {
                              messageSecret: randomBytes(32),
                              supportPayload: {
                                "version": 1,
                                "is_ai_message": true,
                                "should_show_system_message": true,
                                "ticket_id": 1669945700536053
                              }
                            }
                        }
                        await RafAI.relayMessage(sender, responAI, { messageld: generateMessageIDV2(RafAI.user?.id), additionalNodes: RAFAI});
                    }
                }
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Maaf terjadi kesalahan!*" }, { quoted });
            }
            break;
        }
        case "chataivoice": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { audio: {url: `https://api.xyzen.tech/api/tools/texttoaudio?text=Masukkan pertanyaannya dong&apikey=${process.env.TTS_APIKEY}`}, mimetype: 'audio/mp4', ptt: true }, { quoted });
                    break;
                }

                if(type == "imageMessage") {
                    const buffer = await downloadMedia(media, RafAI, "image");
                    const mimpeType = m.messages[0].imageMessage.mimetype;
                    const answer = await GeminiAI(argument, senderId, { buffer, mimeType: mimpeType });
                    await RafAI.sendMessage(sender, { audio: {url: `https://api.xyzen.tech/api/tools/texttoaudio?text=${answer}&apikey=${process.env.TTS_APIKEY}`}, mimetype: 'audio/mp4', ptt: true }, { quoted });
                } else {
                    const answer = await GeminiAI(argument, senderId);
                    await RafAI.sendMessage(sender, { audio: {url: `https://api.xyzen.tech/api/tools/texttoaudio?text=${answer}&apikey=${process.env.TTS_APIKEY}`}, mimetype: 'audio/mp4', ptt: true }, { quoted });
                }
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Maaf pertanyaan terlalu panjang!*" }, { quoted });
            }
            break;
        }
        case "chataireset": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                const response = await delHistoryGemini(senderId);
                await RafAI.sendMessage(sender, { text: `*${response}*` }, { quoted });
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "tebakgambar": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                const { urlImage, jawaban }: { urlImage: string, jawaban: string } | any = await TebakGambar();
                const { url, text }: { url: string, text: boolean } = addTebakGambar(sender, jawaban, urlImage);
                if(text) {
                    await RafAI.sendMessage(sender, { image: { url }, caption: "*By RafAI*" }, { quoted });
                } else {
                    await RafAI.sendMessage(sender, { text: "*Tebak dulu gambar sebelumnya*" }, { quoted });
                    await RafAI.sendMessage(sender, { image: { url }, caption: "*By RafAI*" }, { quoted });
                }
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Maaf terjadi kesalahan!*" }, { quoted });
            }
            break;
        }
        case "jawab": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                const data = getTebakGambar().find((data: any) => data.sender === sender);
                if(!data) {
                    await RafAI.sendMessage(sender, { text: "*Pertanyaan belum ditentukan*" }, { quoted });
                    return false;
                }

                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "*Mohon masukkan pertanyaan!*" });
                    break;
                }

                if(data.jawaban === argument) {
                    const skor = getSkorTebakGambar().find((data: any) => data.senderId === senderId);
                    if(skor) {
                        addSkorTebakGambar(senderId, senderName, skor.skor + 10);
                        await RafAI.sendMessage(sender, { text: `*Jawaban anda benar skor anda sekarang: ${skor.skor + 10}*` }, { quoted });
                    } else {
                        addSkorTebakGambar(senderId, senderName, 10);
                        await RafAI.sendMessage(sender, { text: `*Jawaban anda benar skor anda sekarang: 10*` }, { quoted });
                    }
                    delTebakGambar(sender);
                } else {
                    const skor = getSkorTebakGambar().find((data: any) => data.senderId === senderId);
                    if(skor) {
                        addSkorTebakGambar(senderId, senderName, skor.skor - 5);
                        await RafAI.sendMessage(sender, { text: `*Jawaban anda salah skor anda sekarang: ${skor.skor - 5}*` }, { quoted });
                    } else {
                        addSkorTebakGambar(senderId, senderName, -5);
                        await RafAI.sendMessage(sender, { text: `*Jawaban anda salah skor anda sekarang: -5*` }, { quoted });
                    }
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "buka": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                const type = Object.keys(m.messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2?.message)[0];
                const data = m.messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2?.message[type];
                if(!data || !type) {
                    await RafAI.sendMessage(sender, { text: "*Mohon tag gambar / video sekali lihat 🤤*" }, { quoted });
                    return false;
                }

                const media = await downloadContentFromMessage(
                  data,
                  type === "imageMessage" ? "image" : "video"
                );
                let buffer = Buffer.from([]);
                for await (const chunk of media) {
                  buffer = Buffer.concat([buffer, chunk]);
                }
                if(buffer.length > 0) {
                    if (/video/.test(type)) {
                        await RafAI.sendMessage(sender, {
                            video: buffer,
                            caption: data.caption
                        });
                    } else if(/image/.test(type)) {
                        const bufferNew = await sharp(buffer).toFormat('webp').toBuffer();
                        await RafAI.sendMessage(sender, {
                            image: bufferNew,
                            caption: data.caption
                        });
                    }
                }
            } catch(error) {
                await RafAI.sendMessage(sender, { text: "*Maaf terjadi kesalahan!*" }, { quoted });
                console.log(error);
            }
            break;
        }
        case "skor": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                const skor = getSkorTebakGambar();
                let template: string = `
┏━━━━ SKOR ━━━⬣  
┃
                `;
                skor.forEach((skor: any) => {
                    template += `
┣⊱ ${skor.senderName}: ${skor.skor}\n
                    `;
                })
                template += `
┃
┗━━━━━━━━━━━━━━━━━⬣
                `;
                await RafAI.sendMessage(sender, { text: template }, { quoted });
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "brat": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "*Mohon masukkan teks!*" });
                    break;
                }
                const buffer: any = await Brat(argument);
                const bufferNew = await sharp(buffer).toFormat('webp').toBuffer();
                await RafAI.sendMessage(sender, { sticker: bufferNew, caption: "*Sticker By RafAI*"}, {quoted});
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Maaf terjadi kesalahan!*" }, { quoted });
            }   
            break;
        }
        case "spotify": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "*Mohon masukkan judul lagu!*" });
                    break;
                }

                const response: any = await Spotify(argument);
                let template: string = ``;
                response.forEach((data: any, key: number) => {
                    response[key].idLagu = key + 1;
                    template += `
┏━━━━ SPOTIFY ━━━⬣  
┃
┣⊱ *IdLagu*: ${key + 1}
┣⊱ *Judul*: ${data.title}
┣⊱ *Penyanyi*: ${data.artist}
┣⊱ *Album*: ${data.album}
┣⊱ *Durasi*: ${data.duration}
┃
┗━━━━━━━━━━━━━━⬣
                    `;
                });
                template += `\n*Ketik !play <IdLagu> untuk memutar lagunya*\n`;
                addSpotify(senderId, response);
                await RafAI.sendMessage(sender, { text: template }, { quoted });
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Maaf terjadi kesalahan!*" }, { quoted });
            }
            break;
        }
        case "play": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "*Mohon masukkan id lagu!*" });
                    break;
                }

                const spotify = getSpotify();
                const data = spotify.find((lagu: any) => lagu.senderId === senderId);
                await RafAI.sendMessage(sender, { text: "*Sedang Mengunduh...*" }, { quoted });
                if(data) {
                    const { url } = data.lagu.find((lagu: any) => lagu.idLagu === parseInt(argument));
                    if(!url) await RafAI.sendMessage(sender, { text: "*Lagu / album tidak ditemukan!*" }, { quoted });  
                    await RafAI.sendMessage(sender, { audio: { url: `https://spotifyapi.caliphdev.com/api/download/track?url=${encodeURIComponent(url)}` }, mimetype: "audio/mpeg" }, { quoted });
                } else {
                    await RafAI.sendMessage(sender, { text: "*Lagu / album tidak ditemukan!*" }, { quoted });
                }
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Maaf terjadi kesalahan!*" }, { quoted });
            }
            break;
        }
        case "untik": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "*Mohon masukkan url tiktok!*" });
                    break;
                }

                await RafAI.sendMessage(sender, { text: "*Sedang Mengunduh...*" }, { quoted });
                const urlVideo = await TikTok(argument);
                await RafAI.sendMessage(sender, { video: { url: urlVideo }, mimetype: "video/mp4" }, { quoted });
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Maaf terjadi kesalahan!*" }, { quoted });
            }
            break;
        }
        case "uninsta": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "*Mohon masukkan url instagram!*" });
                    break;
                }

                if(argument.includes("video") || argument.includes("image")) {
                    const type = argument.includes("video") ? "video" : "image";
                    await RafAI.sendMessage(sender, { text: "*Sedang Mengunduh...*" }, { quoted });
                    const url = await Instagram(argument.replace(type, "").trim());
                    if(type === "video") {
                        await RafAI.sendMessage(sender, { video: { url }, mimetype: "video/mp4", caption: "*uninsta by RafAI*" }, { quoted });
                    } else {
                        await RafAI.sendMessage(sender, { image: { url }, caption: "*uninsta by RafAI*" }, { quoted });
                    }
                } else {
                    await RafAI.sendMessage(sender, { text: "*Mohon sertakan type media, Contoh: !uninsta <url> <video>*" }, { quoted });
                }
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Maaf terjadi kesalahan!*" }, { quoted });
            }
            break;
        }
        case "unfb": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "*Mohon masukkan url facebook!*" });
                    break;
                }

                await RafAI.sendMessage(sender, { text: "*Sedang Mengunduh...*" }, { quoted });
                const mediaBuffer = await Facebook(argument);
                await RafAI.sendMessage(sender, { video: { url: mediaBuffer }, caption: "*unfb by RafAI*" }, { quoted });
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: error }, { quoted });
            }
            break;
        }
        case "upscale": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                const imageBuffer = await downloadMedia(media, RafAI);
                await RafAI.sendMessage(sender, { text: "*Sedang Mengunduh...*" }, { quoted });
                const url = await Upscale(imageBuffer);
                await RafAI.sendMessage(sender, { image: { url }, caption: "*upscale by RafAI*" }, { quoted });
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Maaf terjadi kesalahan!*" }, { quoted });
            }
            break;
        }
        case "code": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument && !(type == "documentWithCaptionMessage")) {
                    await RafAI.sendMessage(sender, { text: "*Mohon masukkan code / file source code!*" });
                    break;
                }

                if(type == "documentWithCaptionMessage") {
                    const typeMime = m.messages[0].message?.documentWithCaptionMessage?.message?.documentMessage?.mimetype;
                    const typeMimeValid = [
                        "text/html",
                        "text/css",
                        "text/x-c++src",
                        "text/javascript",
                        "text/json",
                        "text/php",
                        "text/x-python",
                        "application/javascript",
                        "application/x-httpd-php",
                        "application/octet-stream"
                    ];

                    if(typeMimeValid.includes(typeMime)) {
                        const scBuffer = await downloadMedia(media, RafAI);
                        const source = getSource(scBuffer);
                        await RafAI.sendMessage(sender, { text: "*Sedang mengunduh...*" }, { quoted });
                        if(source) {
                            await RafAI.sendMessage(sender, { image: { url: `https://api.xyro.tech/api/carbon?query=${encodeURIComponent(source)}&apikey=Xy-l97DXDkYmh` }, caption: "*code by RafAI*" }, { quoted });
                        } else {
                            await RafAI.sendMessage(sender, { text: "*Maaf source tidak ditemukan!*" }, { quoted });
                        }
                    } else {
                        await RafAI.sendMessage(sender, { text: `*Maaf extensi file tidak didukung, gunakan file dengan extensi: ${typeMimeValid.join(", ")} !*` }, { quoted });
                    }
                } else {
                    await RafAI.sendMessage(sender, { text: "*Sedang mengunduh...*" });
                    await RafAI.sendMessage(sender, { image: {url: `https://api.xyro.tech/api/carbon?query=${encodeURIComponent(argument!)}&apikey=Xy-l97DXDkYmh`}}, { quoted });
                }
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Maaf terjadi kesalahan!*" }, { quoted });
            }
            break;
        }
        case "removebg": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                const mediaBuffer = await downloadMedia(media, RafAI);
                const urlMedia: string | any = await FileUpload(mediaBuffer);
                await RafAI.sendMessage(sender, { text: "*Sedang mengunduh...*" }, { quoted });
                await RafAI.sendMessage(sender, { image: { url: `https://api.xyro.tech/api/removebg?apikey=Xy-l97DXDkYmh&url=${encodeURIComponent(urlMedia)}` }, caption: "*removebg by RafAI*" }, { quoted });
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Maaf terjadi kesalahan!*" }, { quoted });
            }
            break;
        }
        case "cvta": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(m.messages[0].message?.videoMessage) {
                    const buffer = await downloadMedia(media, RafAI, "video");
                    await RafAI.sendMessage(sender, { text: "*Sedang melakukan convert...*" }, { quoted });
                    const bufferAudio: any = await extractAudioFromVideoStream(buffer);
                    await RafAI.sendMessage(sender, { audio: { url: bufferAudio }, caption: "*cvta by RafAI*", mimetype: "audio/mpeg" }, { quoted });
                } else {
                    await RafAI.sendMessage(sender, { text: "*Mohon masukkan video!*" }, { quoted });
                }
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Maaf terjadi kesalahan!*" }, { quoted });
            }
            break;
        }
        case "unyt": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "*Mohon masukkan link yt!*" }, { quoted });
                    break;
                }

                new URL(argument);
                const response  = await RafAI.sendMessage(sender, { text: `*Sedang mengunduh mohon tunggu beberapa menit...*\n\n${argument}` }, { quoted });
                const url = await Youtube(argument);
                await RafAI.sendMessage(sender, { text: `*Berhasil mengunduh, sedang mengirim konten...*\n\n${argument}`, edit: response.key }, { quoted });
                await RafAI.sendMessage(sender, { video: { url }, caption: "*unyt by RafAI*" }, { quoted });
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: `*${error}!*` }, { quoted });
            }
            break;
        }
        case "tebakkata": {
            try {
                const response: { question: string; answer: string } | any = await TebakKata();
                if(response) {
                    const respons = addTebakKata(sender, response.question, response.answer);
                    await RafAI.sendMessage(sender, { text: `${respons.text}\n\n${respons.question}` }, { quoted });
                }
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Maaf terjadi kesalahan!*" }, { quoted });
            }
            break;
        }
        case "jawabkata": {
            try {
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "*Mohon masukkan jawaban tebak kata!*" }, { quoted });
                    break;
                }

                interface Jawaban {
                    sender: string;
                    question: string;
                    answer: string;
                }

                const jawaban = getTebakKata();
                const find = jawaban.find((jawaban: Jawaban | any) => jawaban?.sender === sender);
                if(find) {
                    let skor = getSkorTebakKata().find((skor: any) => skor?.senderId === senderId);
                    if(!skor) skor = { senderId, skor: 0 };
                    
                    if(find.answer.toLowerCase() === argument.toLowerCase()) {
                        await RafAI.sendMessage(sender, { text: `*Jawaban benar, skor anda: ${skor.skor + 10}*` }, { quoted });
                        addSkorTebakKata(senderId, skor.skor + 10);
                        deleteTebakKata(sender);
                    } else {
                        await RafAI.sendMessage(sender, { text: `*Jawaban salah, skor anda: ${skor.skor - 5}*` }, { quoted });
                        addSkorTebakKata(senderId, skor.skor - 5);
                    }
                } else {
                    await RafAI.sendMessage(sender, { text: "*Permainan belum dimulai!*" }, { quoted });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "send": {
            try {
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "*Mohon masukkan nomor dan pesan!*" }, { quoted });
                    break;
                }

                const [ nomor, pesan ] = argument.split(" ");
                if(nomor && pesan) {
                    const nohp = nomor.startsWith("0") ? `${nomor.replace("0", "62")}${extensiPerson}` : `${nomor}${extensiPerson}`;
                    const template = 
`
*From Anonimus*\n
Pesan:\n
${pesan}\n\n
Mau balas pesan ini? ketik !send [nomor tujuan] [pesan]
*Example*: !send 08xxxxxxxx Halo apa kabar?\n
*By Bot RafAI*
`;
                    await RafAI.sendMessage(nohp, { text: template }, { quoted });
                } else {
                    await RafAI.sendMessage(sender, { text: "*Mohon masukkan nomor dan pesan!*" }, { quoted });
                }
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Maaf terjadi kesalahan!*" }, { quoted });
            }
            break;
        }
        case "susunkata": {
            try {
                const response: { question: string; answer: string } | any = await TebakKata();
                if(response) {
                    const respons = addSusunKata(sender, response.question, response.answer);
                    await RafAI.sendMessage(sender, { text: `${respons.text}\n\n${respons.question}` }, { quoted });
                }
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "*Maaf terjadi kesalahan!*" }, { quoted });
            }
            break;
        }
        case "jawabsusun": {
            try {
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "*Mohon masukkan jawaban tebak kata!*" }, { quoted });
                    break;
                }

                interface Jawaban {
                    sender: string;
                    question: string;
                    answer: string;
                }

                const jawaban = getSusunKata();
                const find = jawaban.find((jawaban: Jawaban | any) => jawaban?.sender === sender);
                if(find) {
                    let skor = getSkorSusunKata().find((skor: any) => skor?.senderId === senderId);
                    if(!skor) skor = { senderId, skor: 0 };
                    
                    if(find.answer.toLowerCase() === argument.toLowerCase()) {
                        await RafAI.sendMessage(sender, { text: `*Jawaban benar, skor anda: ${skor.skor + 10}*` }, { quoted });
                        addSkorSusunKata(senderId, skor.skor + 10);
                        deleteSusunKata(sender);
                    } else {
                        await RafAI.sendMessage(sender, { text: `*Jawaban salah, skor anda: ${skor.skor - 5}*` }, { quoted });
                        addSkorSusunKata(senderId, skor.skor - 5);
                    }
                } else {
                    await RafAI.sendMessage(sender, { text: "*Permainan belum dimulai!*" }, { quoted });
                }
            } catch(error) {
                console.log(error);
            }
            break; 
        }

        // GRUP
        case "add": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "*Nomor tidak boleh kosong*" });
                    break;
                };

                if(!sender.includes(extensiGrup)) {
                    await RafAI.sendMessage(sender, { text: "*Anda sedang tidak dalam grup*" });
                    break;
                }

                if(owner().some((owner: any) => owner.senderId === senderId) || cekAksesGrup?.admins?.includes(senderId)) {   
                    const [ ...nomor ] = argument.split(" ");
                    const nohp = nomor.map((no) => no.startsWith("0") ? `${no.replace("0", "62")}${extensiPerson}` : `${no}${extensiPerson}`);
                    if(!owner().some((owner: any) => nohp?.includes(owner.senderId))) {
                        if(nohp){
                            await RafAI.groupParticipantsUpdate(
                                sender, 
                                [...nohp],
                                "add" 
                            );
                        } else {
                            await RafAI.sendMessage(sender, { text: "*Masukkan nomor / tag peserta yang ingin dikick*" });
                        }
                    } else {
                        await RafAI.sendMessage(sender, { text: "*Anda tidak bisa kick saya / owner bot / admin grup*" });
                    }
                } else {
                    await RafAI.sendMessage(sender, { text: "*Anda bukan owner bot / admin grup*" });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "kick": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "Nomor tidak boleh kosong" });
                    break;
                };

                if(!sender.includes(extensiGrup)) {
                    await RafAI.sendMessage(sender, { text: "*Anda sedang tidak dalam grup*" });
                    break;
                }

                if(owner().some((owner: any) => owner.senderId === senderId) || cekAksesGrup?.admins?.includes(senderId)) {   
                    const [ ...nomor ] = argument.split(" ");
                    const nohp = nomor.map((no) => no?.startsWith("0") ? `${no?.replace("0", "62")}${extensiPerson}` : `${no}${extensiPerson}`);
                    if(!owner().some((owner: any) => nohp?.includes(owner.senderId)) && owner().some((owner: any) => mentionId?.includes(owner.senderId))) {
                        if(mentionId) {
                            await RafAI.groupParticipantsUpdate(
                                sender, 
                                [...mentionId],
                                "remove" 
                            );
                        } else if(nohp){
                            await RafAI.groupParticipantsUpdate(
                                sender, 
                                [...nohp],
                                "remove" 
                            );
                        } else {
                            await RafAI.sendMessage(sender, { text: "*Masukkan nomor / tag peserta yang ingin dikick*" });
                        }
                    } else {
                        await RafAI.sendMessage(sender, { text: "*Anda tidak bisa kick saya / owner bot / admin grup*" });
                    }
                } else {
                    await RafAI.sendMessage(sender, { text: "*Anda bukan owner bot / admin grup*" });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "promote": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "Nomor tidak boleh kosong" });
                    break;
                };

                if(!sender.includes(extensiGrup)) {
                    await RafAI.sendMessage(sender, { text: "*Anda sedang tidak dalam grup*" });
                    break;
                }

                if(owner().some((owner: any) => owner.senderId === senderId) || cekAksesGrup?.admins?.includes(senderId)) {   
                    const [ ...nomor ] = argument.split(" ");
                    const nohp = nomor.map((no) => no?.startsWith("0") ? `${no?.replace("0", "62")}${extensiPerson}` : `${no}${extensiPerson}`);
                    if(!owner().some((owner: any) => nohp?.includes(owner.senderId)) && owner().some((owner: any) => mentionId?.includes(owner.senderId))) {
                        if(mentionId) {
                            await RafAI.groupParticipantsUpdate(
                                sender, 
                                [...mentionId],
                                "promote" 
                            );
                        } else if(nohp){
                            await RafAI.groupParticipantsUpdate(
                                sender, 
                                [...nohp],
                                "promote" 
                            );
                        } else {
                            await RafAI.sendMessage(sender, { text: "*Masukkan nomor / tag peserta yang ingin dikick*" });
                        }
                    } else {
                        await RafAI.sendMessage(sender, { text: "*Anda tidak bisa promote saya / owner bot / admin grup*" });
                    }
                } else {
                    await RafAI.sendMessage(sender, { text: "*Anda bukan owner bot / admin grup*" });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "demote": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "Nomor tidak boleh kosong" });
                    break;
                };

                if(!sender.includes(extensiGrup)) {
                    await RafAI.sendMessage(sender, { text: "*Anda sedang tidak dalam grup*" });
                    break;
                }

                if(owner().some((owner: any) => owner.senderId === senderId) || cekAksesGrup?.admins?.includes(senderId)) {   
                    const [ ...nomor ] = argument.split(" ");
                    const nohp = nomor.map((no) => no?.startsWith("0") ? `${no?.replace("0", "62")}${extensiPerson}` : `${no}${extensiPerson}`);
                    if(!owner().some((owner: any) => nohp?.includes(owner.senderId)) && owner().some((owner: any) => mentionId?.includes(owner.senderId))) {
                        if(mentionId) {
                            await RafAI.groupParticipantsUpdate(
                                sender, 
                                [...mentionId],
                                "demote" 
                            );
                        } else if(nohp){
                            await RafAI.groupParticipantsUpdate(
                                sender, 
                                [...nohp],
                                "demote" 
                            );
                        } else {
                            await RafAI.sendMessage(sender, { text: "*Masukkan nomor / tag peserta yang ingin dikick*" });
                        }
                    } else {
                        await RafAI.sendMessage(sender, { text: "*Anda tidak bisa demote saya / owner bot / admin grup*" });
                    }
                } else {
                    await RafAI.sendMessage(sender, { text: "*Anda bukan owner bot / admin grup*" });
                }
            } catch(error) {                
                console.log(error);
            }
            break;
        }
        case "silent": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!sender.includes(extensiGrup)) {
                    await RafAI.sendMessage(sender, { text: "*Anda sedang tidak dalam grup*" });
                    break;
                }

                if(owner().some((owner: any) => owner?.senderId === senderId) || cekAksesGrup?.admins?.includes(senderId)) {
                    await RafAI.groupSettingUpdate(sender, 'announcement');
                } else {
                    await RafAI.sendMessage(sender, { text: "*Anda bukan owner bot / admin grup*" });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "unsilent": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!sender.includes(extensiGrup)) {
                    await RafAI.sendMessage(sender, { text: "*Anda sedang tidak dalam grup*" });
                    break;
                }

                if(owner().some((owner: any) => owner?.senderId === senderId) || cekAksesGrup?.admins?.includes(senderId)) {
                    await RafAI.groupSettingUpdate(sender, 'not_announcement');
                } else {
                    await RafAI.sendMessage(sender, { text: "*Anda bukan owner bot / admin grup*" });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "setsilent": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "Waktu tidak boleh kosong" });
                    break;
                };

                if(!sender.includes(extensiGrup)) {
                    await RafAI.sendMessage(sender, { text: "*Anda sedang tidak dalam grup*" });
                    break;
                }

                if(owner().some((owner: any) => owner?.senderId === senderId) || cekAksesGrup?.admins?.includes(senderId)) {
                    const [ silent, unsilent ] = argument.split("-");
                    if(silent && unsilent) {
                        const response = await addSilent(sender, silent, unsilent);
                        const interval = setInterval(() => {
                            const data: any = getSilent();
                            const date = new Date();
                            const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
                            const minutes = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
                            const seconds = date.getSeconds() > 9 ? data.getSeconds() : `0${data.getSeconds()}`;
                            const time = `${hours}:${minutes}:${seconds}`;
                            
                            data.map( async (grup: any) => {
                                if(grup?.waktuSilent === time) {
                                    await RafAI.groupSettingUpdate(grup?.grupId, 'announcement');
                                } else if(grup?.unsilent === time) {
                                    await RafAI.groupSettingUpdate(grup?.grupId, 'not_announcement');
                                }
                            });
    
                        }, 1000);
                        await RafAI.sendMessage(sender, { text: response }, { quoted });
                    } else {
                        await RafAI.sendMessage(sender, { text: "*Mohon sertakan waktu silent dan unsilent*" }, { quoted });
                    }
                } else {
                    await RafAI.sendMessage(sender, { text: "*Anda bukan owner bot / admin grup*" });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "delsilent": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!sender.includes(extensiGrup)) {
                    await RafAI.sendMessage(sender, { text: "*Anda sedang tidak dalam grup*" });
                    break;
                }

                if(owner().some((owner: any) => owner?.senderId === senderId) || cekAksesGrup?.admins?.includes(senderId)) {
                    const response = await deleteSilent(sender);
                    await RafAI.sendMessage(sender, { text: response }, { quoted });
                } else {
                    await RafAI.sendMessage(sender, { text: "*Anda bukan owner bot / admin grup*" });
                }
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "linkgrup": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!sender.includes(extensiGrup)) {
                    await RafAI.sendMessage(sender, { text: "*Anda sedang tidak dalam grup*" });
                    break;
                }

                const code = await RafAI.groupInviteCode(sender)
                await RafAI.sendMessage(sender, { text: `https://chat.whatsapp.com/${code}` }, { quoted }); 
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "metadatagrup": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!sender.includes(extensiGrup)) {
                    await RafAI.sendMessage(sender, { text: "*Anda sedang tidak dalam grup*" });
                    break;
                }

                const response = await RafAI.groupMetadata(sender);
                const metadata: string = `
┏━━━━ METADATA GRUP ━━━⬣  
┃
┣⊱ *Nama Grup:* ${response?.subject}
┣⊱ *ID Grup:* ${response?.id.split("@")[0]}
┣⊱ *Owner Grup:* ${response?.subjectOwner.split("@")[0] || "Tidak ada"}
┣⊱ *Jumlah Member:* ${response?.size}
┣⊱ *Tanggal Buat:* ${new Date(response?.creation).toLocaleDateString()}
┃
┣⊱ *Deskripsi:* 
┃${response?.desc}
┃
┗━━━━━━━━━━━━━━━━━⬣
                `
                await RafAI.sendMessage(sender, { text: metadata }, { quoted });
            } catch(error) {
                console.log(error);
            }
            break;
        }
        case "join": {
            try {
                await RafAI.sendPresenceUpdate('composing', sender); 
                if(!argument) {
                    await RafAI.sendMessage(sender, { text: "*Mohon sertakan link grup*" }, { quoted });
                    break;
                }

                if(owner().some((owner: any) => owner?.senderId === senderId)) {
                    const response = await RafAI.groupAcceptInviteV4(sender, argument);
                    await RafAI.sendMessage(sender, { text: `Berhasil join grup: ${response}` }, { quoted });
                } else {
                    await RafAI.sendMessage(sender, { text: "*Anda bukan owner bot*" });
                }
            } catch(error) {
                console.log(error);
                await RafAI.sendMessage(sender, { text: "Gagal join grup" }, { quoted });
            }
            break;
        }
        // ENDGRUP
        default: {
            if(!sender.includes(extensiGrup) && argument) {
                try {
                    await RafAI.sendPresenceUpdate('composing', sender); 
                    if(type == "imageMessage" || type == "documentWithCaptionMessage" || type == "videoMessage") {
                        const buffer = await downloadMedia(media, RafAI, "file");
                        const mimeType = type == "imageMessage" ? m.messages[0].message?.imageMessage?.mimetype : 
                                         type == "videoMessage" ? m.messages[0].message?.videoMessage?.mimetype : 
                                         type == "documentWithCaptionMessage" ? m.messages[0].message?.documentWithCaptionMessage?.message?.documentMessage?.mimetype : false;
                        if(mimeType) {
                            if(mimeType.includes("video")) {
                                await RafAI.sendMessage(sender,{ text: "*Sedang menganalisis video, mohon tunggu beberapa saat...*" }, { quoted });
                            } else if(mimeType.includes("image")) {
                                await RafAI.sendMessage(sender,{ text: "*Sedang menganalisis gambar*" }, { quoted });
                            } else {
                                await RafAI.sendMessage(sender,{ text: "*Sedang menganalisis dokumen, mohon tunggu beberapa saat...*" }, { quoted });
                            }
                            await RafAI.sendPresenceUpdate('composing', sender); 
                            const answer = await GeminiAI(argument, senderId, { buffer, mimeType });
                            
                            const RAFAI = [
                                { attrs: { biz_bot: '1' }, tag: 'bot' },
                                { attrs: {}, tag: 'biz' }
                            ];
                                
                            const responAI = {
                                conversation: answer,
                                messageContextInfo: {
                                  messageSecret: randomBytes(32),
                                  supportPayload: {
                                    "version": 1,
                                    "is_ai_message": true,
                                    "should_show_system_message": true,
                                    "ticket_id": 1669945700536053
                                  }
                                }
                            }
                            await RafAI.relayMessage(sender, responAI, { messageld: generateMessageIDV2(RafAI.user?.id), additionalNodes: RAFAI});        
                        } else {
                            await RafAI.sendMessage(sender, { text: "*Maaf file yang valid harus berupa gambar atau dokumen pdf*" }, { quoted });
                        }
                    } else {
                        const answer = await GeminiAI(argument, senderId);  
                        const RAFAI = [
                            { attrs: { biz_bot: '1' }, tag: 'bot' },
                            { attrs: {}, tag: 'biz' }
                        ];       
                        const responAI = {
                            conversation: answer,
                            messageContextInfo: {
                              messageSecret: randomBytes(32),
                              supportPayload: {
                                "version": 1,
                                "is_ai_message": true,
                                "should_show_system_message": true,
                                "ticket_id": 1669945700536053
                              }
                            }
                        }
                        await RafAI.relayMessage(sender, responAI, { messageld: generateMessageIDV2(RafAI.user?.id), additionalNodes: RAFAI});        
                    }
                } catch(error) {
                    console.log(error);
                    await RafAI.sendMessage(sender, { text: "*Maaf Raf AI terjadi kesalahan*" }, { quoted });
                }
            }
        }
    }
    await RafAI.sendPresenceUpdate('paused', sender); 
}

export default menu;