import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getSource = (sc: any) => {
    fs.writeFileSync(path.join(__dirname, '../public/code.js'), sc);
    return fs.readFileSync(path.join(__dirname, '../public/code.js'), 'utf-8');
}

export default getSource;