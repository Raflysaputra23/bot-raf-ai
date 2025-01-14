import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TebakKataProps {
    sender: string;
    question: string;
    answer: string;
}

const getTebakKata = () => {
    if(fs.existsSync(path.join(__dirname, '../data/tebakkata.json'))) {
        return JSON.parse(fs.readFileSync(path.join(__dirname, '../data/tebakkata.json'), 'utf-8'));
    } else {
        return [];
    }
}

const addTebakKata = (sender: string, question: string, answer: string) => {
    const tebakKata: TebakKataProps[] | any = getTebakKata();
    const find = tebakKata?.find((data: TebakKataProps | any) => data?.sender === sender);
    if(find) {
        return { question: find.question, text: "Jawab dulu pertanyaan sebelumnya" };
    } else {
        tebakKata.push({ sender, question, answer });
        fs.writeFileSync(path.join(__dirname, '../data/tebakkata.json'), JSON.stringify(tebakKata));
        return { question, text: "Silahkan menjawab" };
    }
}

const deleteTebakKata = (sender: string) => {
    const tebakKata: TebakKataProps[] | any = getTebakKata();
    const find = tebakKata?.find((data: TebakKataProps | any) => data?.sender === sender);
    if(find) {
        const filter = tebakKata?.filter((data: TebakKataProps | any) => data?.sender !== sender);
        fs.writeFileSync(path.join(__dirname, '../data/tebakkata.json'), JSON.stringify(filter));
        return { text: "Berhasil menghapus pertanyaan" };
    } else {
        return { text: "Pertanyaan tidak ditemukan" };
    }
}

const getSkorTebakKata = () => {
    if(fs.existsSync(path.join(__dirname, '../data/tebakkataskor.json'))) {
        return JSON.parse(fs.readFileSync(path.join(__dirname, '../data/tebakkataskor.json'), 'utf-8'));
    } else {
        return [];
    }
}

interface SkorTebakKataProps {
    senderId: string;
    skor: number;
}

const addSkorTebakKata = (senderId: string, skor: number) => {
    const skors: SkorTebakKataProps[] | any = getSkorTebakKata();
    const find = skors?.find((data: SkorTebakKataProps | any) => data?.senderId === senderId);
    if(find) {
        find.skor = skor;
        const newSkor = skors?.filter((data: SkorTebakKataProps | any) => data?.senderId !== senderId);
        newSkor.push(find);
        fs.writeFileSync(path.join(__dirname, '../data/tebakkataskor.json'), JSON.stringify(newSkor));
        return { text: "Skor berhasil ditambahkan" };
    } else {
        skors.push({ senderId, skor });
        fs.writeFileSync(path.join(__dirname, '../data/tebakkataskor.json'), JSON.stringify(skors));
        return { text: "Skor berhasil ditambahkan" };
    }
}

export { getTebakKata, addTebakKata, deleteTebakKata, getSkorTebakKata, addSkorTebakKata };