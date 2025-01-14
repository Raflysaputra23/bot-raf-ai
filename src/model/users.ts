import { Schema, Document } from "mongoose";

interface usersDocument extends Document {
    notelp: string,
    username: string,
    role: string,
}

const usersCollection: string = 'user'; 

const usersSchema = new Schema<usersDocument>({
    notelp: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        required: true
    }
});

export {  usersCollection , usersSchema };