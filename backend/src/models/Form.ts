import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
    questionKey: string;
    fieldId: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];  
    conditions?: {
        questionKey: string;
        operator: 'equals' | 'notEquals' | 'contains';
        value: string;
        logic: 'AND' | 'OR';
    }[];
}

export interface IForm extends Document {
    owner: mongoose.Types.ObjectId;
    baseId: string;
    tableId: string;
    title: string;
    description?: string;
    questions: IQuestion[];
    createdAt: Date;
    updatedAt: Date;
}

const QuestionSchema = new Schema({
    questionKey: { type: String, required: true },
    fieldId: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true },
    required: { type: Boolean, default: false },
    options: [{ type: String }],
    conditions: [{
        questionKey: { type: String },
        operator: { type: String, enum: ['equals', 'notEquals', 'contains'] },
        value: { type: String },
        logic: { type: String, enum: ['AND', 'OR'] }
    }]
});

const FormSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    baseId: { type: String, required: true },
    tableId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [QuestionSchema]
}, {
    timestamps: true
});

export default mongoose.model<IForm>('Form', FormSchema);
