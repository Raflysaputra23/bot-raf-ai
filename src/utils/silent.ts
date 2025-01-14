import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getSilent = () => {
    if(fs.existsSync(path.join(__dirname, "../data/silent.json"))) {
        const silent = fs.readFileSync(path.join(__dirname, "../data/silent.json"), 'utf-8');
        return JSON.parse(silent);
    } else {
        return [];
    }    
}

const addSilent = (grupId: string, waktuSilent: string, unsilent: string) => {
    const sil: any = getSilent();
    if(sil.some((grup: any) => grup?.grupId === grupId)) {
        const newSilent = sil.filter((grup: any) => grup?.grupId !== grupId);
        newSilent.push({ grupId, waktuSilent, unsilent });
        fs.writeFileSync(path.join(__dirname, "../data/silent.json"), JSON.stringify(newSilent));
        return "Silent berhasil ditambahkan";
    } else {
        sil.push({ grupId, waktuSilent, unsilent });
        fs.writeFileSync(path.join(__dirname, "../data/silent.json"), JSON.stringify(sil));
        return "Silent berhasil ditambahkan";
    }
}

const deleteSilent = (grupId: string) => {
    const sil: any = getSilent();
    if(sil.some((grup: any) => grup?.grupId === grupId)) {
        const newSilent = sil.filter((grup: any) => grup?.grupId !== grupId);
        fs.writeFileSync(path.join(__dirname, "../data/silent.json"), JSON.stringify(newSilent));
        return "Silent berhasil dihapus";
    } else {
        return "Silent tidak ditemukan";
    }
}

export { addSilent, deleteSilent, getSilent };