import mongoose from "mongoose"
import { systemConfig } from "./systemConfig.js";

export const connectingDb = async () =>{
    try {
        await mongoose.connect(systemConfig.mongo.uri)
        console.log("MongoDb connected...");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}