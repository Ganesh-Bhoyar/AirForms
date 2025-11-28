import { Request, Response } from 'express';
import Form from '../models/Form';
import User from '../models/User';
import ResponseModel from '../models/Response';
import axios from 'axios';
import { AIRTABLE_CONFIG } from '../config/oauth';
import { getValidToken } from '../services/airtableService';

export const submitForm = async (req: Request, res: Response) => {
    try {
        const { formId } = req.params;
        const { answers } = req.body;

        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Validate required fields
        for (const question of form.questions) {
            if (question.required && !answers[question.questionKey]) {
                return res.status(400).json({ error: `Missing required field: ${question.label}` });
            }
        }

        // Map answers to Airtable fields
        const fields: Record<string, any> = {};
        for (const question of form.questions) {
            const answer = answers[question.questionKey];
            if (answer !== undefined && answer !== '') {
                fields[question.fieldId] = answer;
            }
        }

        const owner = await User.findById(form.owner);
        if (!owner) {
            return res.status(500).json({ error: 'Form owner not found' });
        }

        const token = await getValidToken(owner);

        const airtableResponse = await axios.post(
            `${AIRTABLE_CONFIG.API_URL}/${form.baseId}/${form.tableId}`,
            { fields },
            { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );

        const airtableRecordId = airtableResponse.data.id;

        const responseEntry = await ResponseModel.create({
              formId: form._id,
            airtableRecordId,
            answers,
            syncedAt: new Date()
        });

        res.status(201).json(responseEntry);

    } catch (error: any) {
        console.error('Submission error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to submit form' });
    }
};

export const getResponses = async (req: Request, res: Response) => {
    try {
        const { formId } = req.params;
        // Verify ownership
        const userId = (req as any).user.id;
        const form = await Form.findOne({ _id: formId, owner: userId });

        if (!form) {
            return res.status(404).json({ error: 'Form not found or unauthorized' });
        }

        const responses = await ResponseModel.find({ formId }).sort({ createdAt: -1 });
        res.json(responses);
    } catch (error: any) {
        console.error('Error fetching responses:', error);
        res.status(500).json({ error: 'Failed to fetch responses' });
    }
};
