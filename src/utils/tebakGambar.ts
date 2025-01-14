import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getTebakGambar = () => {
    if(fs.existsSync(path.join(__dirname, '../data/tebakgambar.json'))) {
        return JSON.parse(fs.readFileSync(path.join(__dirname, '../data/tebakgambar.json'), 'utf-8'));
    } else {
        return [];
    }
}

const addTebakGambar = (sender: string, jawaban: string, urlImage: string) => {
    const tebakGambar = getTebakGambar();
    const data = tebakGambar.find((data: any) => data.sender === sender);
    if(!data) {
        tebakGambar.push({ sender, jawaban, urlImage });
        fs.writeFileSync(path.join(__dirname, '../data/tebakgambar.json'), JSON.stringify(tebakGambar));
        return { url: urlImage, text: true };
    } else {
        return { url: data.urlImage, text: false };
    }
}

const delTebakGambar = (sender: string) => {
    const tebakGambar = getTebakGambar();
    const newTebakGambar = tebakGambar.filter((data: any) => data.sender !== sender);
    fs.writeFileSync(path.join(__dirname, '../data/tebakgambar.json'), JSON.stringify(newTebakGambar));
    return "Tebak gambar berhasil dihapus";
}

const getSkorTebakGambar = () => {
    if(fs.existsSync(path.join(__dirname, "../data/skortebakgambar.json"))) {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "../data/skortebakgambar.json"), 'utf-8'));
    } else {
        return [];
    }
}

const addSkorTebakGambar = (senderId: string, senderName: string, skor: number) => {
    const skorTebakGambar = getSkorTebakGambar();
    const data = skorTebakGambar.find((data: any) => data.senderId === senderId);
    if(data) {
        const newSkorTebakGambar = skorTebakGambar.filter((data: any) => data.senderId !== senderId);
        newSkorTebakGambar.push({ senderId, senderName, skor });
        fs.writeFileSync(path.join(__dirname, "../data/skortebakgambar.json"), JSON.stringify(newSkorTebakGambar));
        return skor;
    } else {
        skorTebakGambar.push({ senderId, senderName, skor });
        fs.writeFileSync(path.join(__dirname, "../data/skortebakgambar.json"), JSON.stringify(skorTebakGambar));
        return skor;
    }
}

export { getTebakGambar, addTebakGambar, delTebakGambar, getSkorTebakGambar, addSkorTebakGambar };