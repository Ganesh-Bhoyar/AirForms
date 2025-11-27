import { Request, Response } from 'express';
import * as airtableService from '../services/airtableService';
import User from '../models/User';

export const getBases = async (req: Request, res: Response) => {
    try {
        // @ts-ignore - user is attached by auth middleware (we need to create that middleware properly or use the one from auth check)
        // For now assuming req.user or we fetch it. 
        // Actually, we should use a middleware to populate req.user from the JWT token.

        // Let's assume we have the user ID from the token in req.user (we need to implement the middleware)
        // For this step, I will implement a quick middleware in this file or import it if I had one.
        // I haven't created a proper auth middleware yet, so I will do that first or handle it here.

        // Let's rely on the token in the cookie.
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        // We need to decode it. Ideally use a middleware.
        // I'll implement the middleware in a separate file in the next step, but for now let's assume it's there.
        // Wait, I should create the middleware first to be clean.

        // Let's just write the controller logic assuming req.user is populated.
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
