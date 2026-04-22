import mongoose, { Model, Document, Schema } from "mongoose";


interface userSchemaProps extends Document {
    username: string,
    email: string,
    password: string,
    createdAt: Date

}


const userSchema: Schema<userSchemaProps> = new Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }




}, { timestamps: true })


const User: Model<userSchemaProps> = mongoose.models.User || mongoose.model("User", userSchema)

export default User