import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getSession = () => {
  if(fs.existsSync(path.join(__dirname, "../data/sessionAI.json"))) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "../data/sessionAI.json"), 'utf-8'));
  } else {
    return [];
  }
}

const cekSession = (senderId: string) => {
  const session = getSession();
  const cekSession = session.find((session: any) => session?.senderId === senderId);
  if(cekSession) {
    return cekSession.history;
  } else {
    return [];
  }
}

const addSession = (senderId: string, history: any) => {
  const session = getSession();
  const cekSession = session.find((session: any) => session?.senderId === senderId);
  if(cekSession) {
    cekSession.history.push(history);
    const newSession = session.filter((session: any) => session?.senderId !== senderId);
    newSession.push(cekSession);
    fs.writeFileSync(path.join(__dirname, "../data/sessionAI.json"), JSON.stringify(session));
  } else {
    session.push({ senderId, history: [history] });
    fs.writeFileSync(path.join(__dirname, "../data/sessionAI.json"), JSON.stringify(session));
  }
}

const delSession = (sessionId: string) => {
  const session = getSession();
  const newSession = session.filter((session: any) => session?.senderId !== sessionId);
  fs.writeFileSync(path.join(__dirname, "../data/sessionAI.json"), JSON.stringify(newSession));
  return "Session berhasil dihapus";
}

export { getSession, cekSession, addSession, delSession };