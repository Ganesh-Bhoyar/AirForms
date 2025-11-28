import { Request, Response } from 'express';
import * as airtableService from '../services/airtableService';
import User from '../models/User';

export const getBases = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ error: 'User not found' });

        const bases = await airtableService.getBases(user);
        res.json(bases);
    } catch (error: any) {
        console.error('Error fetching bases:', error);
        res.status(500).json({ error: 'Failed to fetch bases' });
    }
};

export const getTables = async (req: Request, res: Response) => {
    try {
        const { baseId } = req.params;
        const userId = (req as any).user.id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ error: 'User not found' });

        const tables = await airtableService.getTables(user, baseId);
        res.json(tables);
    } catch (error: any) {
        console.error('Error fetching tables:', error);
        res.status(500).json({ error: 'Failed to fetch tables' });
    }
};
