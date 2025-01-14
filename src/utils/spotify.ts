import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getSpotify = () => {
    if(fs.existsSync(path.join(__dirname, "../data/spotify.json"))) {
        const spotify = fs.readFileSync(path.join(__dirname, "../data/spotify.json"), 'utf-8');
        return JSON.parse(spotify);
    } else {
        return [];
    }
}

const addSpotify = (senderId: string, lagu: string) => {
    const spotify = getSpotify();
    if(spotify.some((lagu: any) => lagu.senderId === senderId)) {
        const newSpotify = spotify.filter((lagu: any) => lagu.senderId !== senderId);
        newSpotify.push({ senderId, lagu });
        fs.writeFileSync(path.join(__dirname, "../data/spotify.json"), JSON.stringify(newSpotify));
        return "Spotify berhasil ditambahkan";
    } else {
        spotify.push({ senderId, lagu });
        fs.writeFileSync(path.join(__dirname, "../data/spotify.json"), JSON.stringify(spotify));
        return "Spotify berhasil ditambahkan";
    }
}

export { getSpotify, addSpotify };