import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
}

const userSchema: Schema = new Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 100,
        match: /^[A-Za-z]+$/
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 100,
        match: /^[A-Za-z]+$/
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/
    }
});

export const User = mongoose.model<IUser>('User', userSchema);