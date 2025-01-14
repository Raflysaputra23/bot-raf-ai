import { Schema, Document } from "mongoose";

interface historysDocument extends Document {
    senderId: string;
    history: string[];
}

const historysCollection: string = 'history'; 

const historysSchema = new Schema({
    senderId: {
        type: String,
        required: true
    },
    history: [
        { 
            role: { 
                type: String, 
                required: true 
            },
            parts: [{ 
                text: { 
                    type: String, 
                    required: true 
                } 
            }]
        },
    ]
});

export {  historysCollection , historysSchema };