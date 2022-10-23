import * as mongoose from "mongoose"

export default class Connection {
    constructor() {
        const uri = process.env.DATABASE_URI
        if(!uri)
            throw new Error("Please provide DATABASE_URI")
        
        mongoose.connect(uri)
    }
}