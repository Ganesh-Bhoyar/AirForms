import { Request, Response } from 'express';
import Form from '../models/Form';

export const createForm = async (req: Request, res: Response) => {
    try {
        const { baseId, tableId, title, description, questions } = req.body;
        const userId = (req as any).user.id;

        const form = await Form.create({
            owner: userId,
            baseId,
            tableId,
            title,
            description,
            questions
        });

        res.status(201).json(form);
    } catch (error: any) {
        console.error('Error creating form:', error);
        res.status(500).json({ error: 'Failed to create form' });
    }
};

export const getMyForms = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const forms = await Form.find({ owner: userId }).sort({ createdAt: -1 });
        res.json(forms);
    } catch (error: any) {
        console.error('Error fetching forms:', error);
        res.status(500).json({ error: 'Failed to fetch forms' });
    }
};

export const getFormById = async (req: Request, res: Response) => {
    try {
        const { formId } = req.params;
        const form = await Form.findById(formId);

        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Public access is allowed, so no owner check here for viewing
        res.json(form);
    } catch (error: any) {
        console.error('Error fetching form:', error);
        res.status(500).json({ error: 'Failed to fetch form' });
    }
};

export const updateForm = async (req: Request, res: Response) => {
    try {
        const { formId } = req.params;
        const userId = (req as any).user.id;
        const updates = req.body;

        const form = await Form.findOne({ _id: formId, owner: userId });

        if (!form) {
            return res.status(404).json({ error: 'Form not found or unauthorized' });
        }

        Object.assign(form, updates);
        await form.save();

        res.json(form);
    } catch (error: any) {
        console.error('Error updating form:', error);
        res.status(500).json({ error: 'Failed to update form' });
    }
};

export const deleteForm = async (req: Request, res: Response) => {
    try {
        const { formId } = req.params;
        const userId = (req as any).user.id;

        const form = await Form.findOneAndDelete({ _id: formId, owner: userId });

        if (!form) {
            return res.status(404).json({ error: 'Form not found or unauthorized' });
        }

        res.json({ message: 'Form deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting form:', error);
        res.status(500).json({ error: 'Failed to delete form' });
    }
};
