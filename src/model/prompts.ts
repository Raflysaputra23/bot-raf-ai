import { Schema, Document } from "mongoose";

interface promptsDocument extends Document {
    prompt: string
}

const promptsCollection: string = 'prompt'; 

const promptsSchema = new Schema<promptsDocument>({
    prompt: {
        type: String,
        required: true
    }
});

export {  promptsCollection , promptsSchema };