import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();


class Database {
    public collection: string;
    public schema: any;

    constructor(collection: string, schema: any) {
        (async() => {
            try {
                await mongoose.connect(process.env.MONGO_URI as string);
            } catch (error) {
                console.log('Database connection error:', error);
            }
        })();

        this.collection = collection;
        this.schema = schema;
    }

    InsertOne = async (document: any) => {
        try {
            return await mongoose.model(this.collection, this.schema).create(document);
        }catch(error) {
            console.log(error);
        }
    }

    InsertMany = async (documents: any) => {
        try {
            return await mongoose.model(this.collection, this.schema).insertMany(documents);
        }catch(error) {
            console.log(error);
        }
    }

    FindOne = async (filter: any) => {
        try {
            return await mongoose.model(this.collection, this.schema).findOne(filter);
        } catch(error) {
            console.log(error);
        }
    }

    FindMany = async (sort: any = { createAt: 1 }) => {
        try {
            return await mongoose.model(this.collection, this.schema).find().sort(sort);
        } catch(error) {
            console.log(error);

        }
    }

    UpdateOne = async (filter: any, update: any) => {
        try {
            return await mongoose.model(this.collection, this.schema).updateOne(filter, update);
        } catch(error) {
            console.log(error);
        }
    }

    UpdateMany = async (filter: any, update: any) => {
        try {
            return await mongoose.model(this.collection, this.schema).updateMany(filter, update);
        } catch(error) {
            console.log(error);
        }
    }

    DeleteOne = async (filter: any) => {
        try {
            return await mongoose.model(this.collection, this.schema).deleteOne(filter);
        } catch(error) {
            console.log(error);
        }
    }

    DeleteMany = async (filter: any) => {
        try {
            return await mongoose.model(this.collection, this.schema).deleteMany(filter);
        } catch(error) {
            console.log(error);
        }
    }    
}

export default Database;