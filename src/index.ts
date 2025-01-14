import express, { Request, Response } from "express";
import { DisconnectReason, makeInMemoryStore, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { makeWASocket } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom'
import { fileURLToPath } from "url";
import path from "path";

// utils
import parsing from "./utils/parsing.js";

// ROUTER
import imageRouter from "./controller/image.js";
import menu from "./menu.js";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BotRafAI = async () => {
    interface MultiFileAuthState {
        state: any,
        saveCreds: any
    }

    // const store = makeInMemoryStore({ });
    // if(fs.existsSync(path.join(__dirname, './DataBot/bot_raf_ai_store.json'))) {
    //     store.readFromFile(path.join(__dirname, './DataBot/bot_raf_ai_store.json'));
    // } else {
    //     store.writeToFile(path.join(__dirname, './DataBot/bot_raf_ai_store.json'));
    // }

    // setInterval(() => {
    //     store.writeToFile(path.join(__dirname, './DataBot/bot_raf_ai_store.json'));
    // }, 10_000);

    const { state, saveCreds }: MultiFileAuthState = await useMultiFileAuthState(path.join(__dirname, './DataBot'));
    const RafAI = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        browser: [ 'Windows', 'Chrome', '11'],
    });

    // store.bind(RafAI.ev);

    RafAI.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
            if(shouldReconnect) {
                BotRafAI()
            }
        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })

    const { default: PQueue } = await import('p-queue');
    const messageQueue = new PQueue({ concurrency: 3 });

    RafAI.ev.on('messages.upsert', m => {
        messageQueue.add(async () => {
            if (!m.messages[0].key.fromMe) {
                const message = parsing(m);
                if(message != false) {
                    menu(message, RafAI);
                }
            }
        })
    });

    RafAI.ev.on("group-participants.update", async (update) => {
        try {
            const { id, participants, action } = update;
            switch(action) {
                case "add": {
                    for (const participant of participants) {
                        await RafAI.sendMessage(id, { 
                            text: `*Selamat datang di grup, ${participant.split("@")[0]} Silahkan Intro Terlebih Dahulu*`, 
                            mentions: [participant] 
                        });
                    }
                    break;
                }
                case "promote": {
                    for (const participant of participants) {
                        await RafAI.sendMessage(id, { 
                            text: `*Selamat ${participant.split("@")[0]}, Anda menjadi admin*`, 
                            mentions: [participant] 
                        });
                    }
                    break;
                }
                case "demote": {
                    for (const participant of participants) {
                        await RafAI.sendMessage(id, { 
                            text: `*Yah Sayang sekali, ${participant.split("@")[0]} diturunkan menjadi admin*`, 
                            mentions: [participant] 
                        });
                    }
                    break;
                }
            }             
        } catch (error) {
            console.error("Terjadi error saat menangani event group-participants.update:", error);
        }
    });

    await messageQueue.onIdle();
    RafAI.ev.on ('creds.update', saveCreds);
};
BotRafAI();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/image", express.static(path.join(__dirname, '../public')));

app.use(imageRouter);

app.use((req: Request, res: Response)=> {
    res.status(404).send("Not Found");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

