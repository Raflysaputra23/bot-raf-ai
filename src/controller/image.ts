import express, { Request, Response } from 'express';
import { fileURLToPath } from "url";
import path from "path";
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/image/:filename", (req: Request, res: Response) => {
    const { filename } = req.params;
    const dirname = path.join(__dirname, '../public', filename);

    res.sendFile(dirname, (err) => {
        if (err) {
            res.status(500).send("File tidak ditemukan");
        }
    });
});

export default router;