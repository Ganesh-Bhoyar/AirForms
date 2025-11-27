import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    airtableId: string;
    email?: string;
    name?: string;
    accessToken: string;
    refreshToken: string;
    tokenExpiry: Date;
    lastLogin: Date;
}

const UserSchema: Schema = new Schema({
    airtableId: { type: String, required: true, unique: true },
    email: { type: String },
    name: { type: String },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    tokenExpiry: { type: Date, required: true },
    lastLogin: { type: Date, default: Date.now },
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
