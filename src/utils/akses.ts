import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AksesGrup {
    idGrup: string;
    admins: string[];
    izinMember: boolean | string;
}

const aksesGrup = () => {
    if(fs.existsSync(path.join(__dirname, "../data/akses_grup.json"))) {
        const aksesGrup: string = fs.readFileSync(path.join(__dirname, "../data/akses_grup.json"), 'utf-8');
        return JSON.parse(aksesGrup);
    } else {
        return [];
    }
}

const addAksesGrup = (idGrup: string, admins: string[], izinMember: boolean | string) => {
    const akses: AksesGrup[] = aksesGrup();
    if(!akses.some((grup: AksesGrup) => grup?.idGrup === idGrup)) {
        akses.push({ idGrup, admins, izinMember: izinMember == "true" ? true : false });
        fs.writeFileSync(path.join(__dirname, "../data/akses_grup.json"), JSON.stringify(akses));
        return "Akses grup berhasil ditambahkan";
    } else {
        return "Akses grup sudah ada";
    }
}

const deleteAksesGrup = (idGrup: string, admins: string[]) => {
    const akses: AksesGrup[] = aksesGrup();
    const findAkses = akses.find((grup: AksesGrup) => grup?.idGrup === idGrup);
    if(findAkses && admins) {
        const findAdmins = findAkses.admins.filter((admin: string) => !admins.includes(admin));
        findAkses.admins = findAdmins;
        const newAksesGrup = akses.filter((grup: AksesGrup) => grup.idGrup !== idGrup);
        newAksesGrup.push(findAkses);
        fs.writeFileSync(path.join(__dirname, "../data/akses_grup.json"), JSON.stringify(newAksesGrup));
        return "Akses admin grup berhasil dihapus";
    } else if(findAkses) {
        const newAksesGrup = akses.filter((grup: AksesGrup) => grup.idGrup !== idGrup);
        fs.writeFileSync(path.join(__dirname, "../data/akses_grup.json"), JSON.stringify(newAksesGrup));
        return "Akses grup berhasil dihapus";
    } else {
        return "Grup tidak ditemukan";
    }
}

const updateAksesGrup = (idGrup: string, admins: string[], izinMember: boolean | string) => {
    const akses: AksesGrup[] = aksesGrup();
    const findAkses = akses.find((grup: AksesGrup) => grup?.idGrup === idGrup);
    if(findAkses) {
        findAkses.admins.push(...admins);
        console.log(findAkses);
        findAkses.izinMember = izinMember == "true" ? true : false;
        const newAksesGrup = akses.filter((grup: AksesGrup) => grup.idGrup !== idGrup);
        newAksesGrup.push(findAkses);
        fs.writeFileSync(path.join(__dirname, "../data/akses_grup.json"), JSON.stringify(newAksesGrup));
        return "Akses grup berhasil diupdate";
    } else {
        return "Akses grup tidak ditemukan";
    }
}

const blokir = () => {
    if(fs.existsSync(path.join(__dirname, "../data/akses_person.json"))) {
        const akses: string = fs.readFileSync(path.join(__dirname, "../data/akses_person.json"), 'utf-8');
        return JSON.parse(akses);
    } else {
        return [];
    }
}

const addBlokir = (senderId: string) => {
    const akses: string[] = blokir();
    if(!akses.includes(senderId)) {
        akses.push(senderId);
        fs.writeFileSync(path.join(__dirname, "../data/akses_person.json"), JSON.stringify(akses));
        return "Blokir berhasil ditambahkan";
    } else {
        return "Blokir sudah ada";
    }
}

const deleteBlokir = (senderId: string) => {
    const blok: string[] = blokir();
    if(blok.includes(senderId)) {
        const newBlokir = blok.filter((id: string) => id !== senderId);
        fs.writeFileSync(path.join(__dirname, "../data/akses_person.json"), JSON.stringify(newBlokir));
        return "Blokir berhasil dihapus";
    } else {
        return "Blokir tidak ditemukan";
    }
}

export { aksesGrup, blokir, addBlokir, deleteBlokir, addAksesGrup, deleteAksesGrup, updateAksesGrup };