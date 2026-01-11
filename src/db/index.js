import mongoose  from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connnectionInstence = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB Connected..! DB HOST: ${connnectionInstence.connection.host}`)
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;