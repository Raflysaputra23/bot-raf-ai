
const parsingCommand = (type: string, m: any) => {
    switch(type) {
        case "conversation":
            return m.messages[0].message.conversation;
        case "extendedTextMessage":
            return m.messages[0].message?.extendedTextMessage.text;
        case "imageMessage":
            return m.messages[0].message?.imageMessage.caption;
        case "videoMessage":
            return m.messages[0].message?.videoMessage.caption;
        case "text":
            return m.messages[0].message?.text;
        case "documentWithCaptionMessage":
            return m.messages[0].message?.documentWithCaptionMessage.message.documentMessage.caption;
        default:
            return false;
    }
}

const parsing = (m: any) => {
    try {
        const sender = m.messages[0].key.remoteJid;
        const type = ( m.messages[0].message?.documentWithCaptionMessage ) ? Object.keys(m.messages[0].message)[1] : Object.keys(m.messages[0].message)[0];
        const body = parsingCommand(type, m);
        if(!body) new Error("Message not found");
        
        const prefix: string = body.slice(0, 1);
        const command: string = body.slice(1).trim().split(/ +/).shift().toLowerCase();
        const argument: string | null = body.slice(1).trim().split(/ +/).slice(1).join(' ');
        if(prefix !== "!" && sender.includes("628")) {
            return { command, prefix, argument : body, type, m };
        } else if(prefix === "!") {
            return { command, prefix, argument, type, m };
        } else {
            throw new Error("Prefix not found");
        }
    } catch(error) {
        return false;
    }
}

export default parsing;