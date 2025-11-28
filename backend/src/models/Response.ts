import mongoose, { Schema, Document } from 'mongoose';

export interface IResponse extends Document {
    formId: mongoose.Types.ObjectId;
    airtableRecordId: string;
    answers: Record<string, any>;
    syncedAt: Date;
    deletedInAirtable: boolean;
}

const ResponseSchema = new Schema({
    formId: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
    airtableRecordId: { type: String, required: true },
    answers: { type: Map, of: Schema.Types.Mixed },
    syncedAt: { type: Date, default: Date.now },
    deletedInAirtable: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model<IResponse>('Response', ResponseSchema);
