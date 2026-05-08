import mongoose, { Model, Document, Schema } from "mongoose";


interface userSchemaProps extends Document {
    role: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string
    createdAt: Date
    resetToken?: string,
    resetTokenExpiry?: Date

}


const userSchema: Schema<userSchemaProps> = new Schema({

    role: {
        type: String,
        enum: ["recruiter", "jobSeeker"],
        required: true
    },
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
    },
    confirmPassword: {
        type: String,
        require: true
    },
    resetToken: {                  //
        type: String,
        default: null
    },
    resetTokenExpiry: {            
        type: Date,
        default: null
    }




}, { timestamps: true })


const User: Model<userSchemaProps> = mongoose.models.User || mongoose.model("User", userSchema)

export default User