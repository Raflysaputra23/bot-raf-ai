import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Owner {
    senderId: string;
    senderName: string;
}

const owner = () => {
    if(fs.existsSync(path.join(__dirname, "../data/owner.json"))) {
            const aksesGrup: string = fs.readFileSync(path.join(__dirname, "../data/owner.json"), 'utf-8');
            return JSON.parse(aksesGrup);
        } else {
            return [];
        }
}

const addOwner = (senderId: string, senderName: string) => {
    const ownerNew: Owner[] = owner();
    if(!ownerNew.some((owner: Owner) => owner.senderId === senderId)) {
        ownerNew.push({senderId, senderName});
        fs.writeFileSync(path.join(__dirname, "../data/owner.json"), JSON.stringify(ownerNew));
        return "Owner berhasil ditambahkan";
    } else {
        return "Owner sudah ada";
    }
}

const deleteOwner = (senderId: string) => {
    const ownerNew: Owner[] = owner();
    if(ownerNew.some((owner: Owner) => owner.senderId === senderId)) {
        const newOwner = ownerNew.filter((owner: Owner) => owner.senderId !== senderId);
        fs.writeFileSync(path.join(__dirname, "../data/owner.json"), JSON.stringify(newOwner));
        return "Owner berhasil dihapus";
    } else {
        return "Owner tidak ditemukan";
    }
}


export { owner, addOwner, deleteOwner };