import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SusunKataProps {
    sender: string;
    question: string;
    answer: string;
}

const getSusunKata = () => {
    if(fs.existsSync(path.join(__dirname, '../data/susunkata.json'))) {
        return JSON.parse(fs.readFileSync(path.join(__dirname, '../data/susunkata.json'), 'utf-8'));
    } else {
        return [];
    }
}

const addSusunKata = (sender: string, question: string, answer: string) => {
    const susunKata: SusunKataProps[] | any = getSusunKata();
    const find = susunKata?.find((data: SusunKataProps | any) => data?.sender === sender);
    if(find) {
        return { question: find.question, text: "Jawab dulu pertanyaan sebelumnya" };
    } else {
        susunKata.push({ sender, question, answer });
        fs.writeFileSync(path.join(__dirname, '../data/susunkata.json'), JSON.stringify(susunKata));
        return { question, text: "Silahkan menjawab" };
    }
}

const deleteSusunKata = (sender: string) => {
    const susunKata: SusunKataProps[] | any = getSusunKata();
    const find = susunKata?.find((data: SusunKataProps | any) => data?.sender === sender);
    if(find) {
        const filter = susunKata?.filter((data: SusunKataProps | any) => data?.sender !== sender);
        fs.writeFileSync(path.join(__dirname, '../data/susunkata.json'), JSON.stringify(filter));
        return { text: "Berhasil menghapus pertanyaan" };
    } else {
        return { text: "Pertanyaan tidak ditemukan" };
    }
}

const getSkorSusunKata = () => {
    if(fs.existsSync(path.join(__dirname, '../data/susunkataskor.json'))) {
        return JSON.parse(fs.readFileSync(path.join(__dirname, '../data/susunkataskor.json'), 'utf-8'));
    } else {
        return [];
    }
}

interface SkorSusunKata {
    senderId: string;
    skor: number;
}

const addSkorSusunKata = (senderId: string, skor: number) => {
    const skors: SkorSusunKata[] | any = getSkorSusunKata();
    const find = skors?.find((data: SkorSusunKata | any) => data?.senderId === senderId);
    if(find) {
        find.skor = skor;
        const newSkor = skors?.filter((data: SkorSusunKata | any) => data?.senderId !== senderId);
        newSkor.push(find);
        fs.writeFileSync(path.join(__dirname, '../data/susunkataskor.json'), JSON.stringify(newSkor));
        return { text: "Skor berhasil ditambahkan" };
    } else {
        skors.push({ senderId, skor });
        fs.writeFileSync(path.join(__dirname, '../data/susunkataskor.json'), JSON.stringify(skors));
        return { text: "Skor berhasil ditambahkan" };
    }
}

export { getSusunKata, addSusunKata, deleteSusunKata, getSkorSusunKata, addSkorSusunKata };