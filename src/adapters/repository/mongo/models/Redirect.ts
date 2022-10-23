import { Schema, model } from "mongoose"

interface Redirect {
    isDeleted: boolean
    code: string
    url: string
    createdAt: Date
}

const schema = new Schema<Redirect>({
    isDeleted: { type: Boolean, required: true, default: false },
    code: { type: String, required: true },
    url: { type: String, required: true },
    createdAt: { type: Date, required: true }
})

export default model<Redirect>("Redirect", schema)