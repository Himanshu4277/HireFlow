import  { Schema, models, model } from "mongoose";


interface ContactType {
    name: string;
    email: string;
    subject: string;
    desc: string;
}

const contactSchema = new Schema<ContactType>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
});


const ContactForm =
    models.ContactForm || model<ContactType>("ContactForm", contactSchema);

export default ContactForm;