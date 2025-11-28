import { Request, Response } from 'express';
import ResponseModel from '../models/Response';
import Form from '../models/Form';
import User from '../models/User';
import axios from 'axios';
import { AIRTABLE_CONFIG } from '../config/oauth';
import { getValidToken } from '../services/airtableService';

export const handleWebhook = async (req: Request, res: Response) => {
    try {

        const { base: { id: baseId }, webhook: { id: webhookId }, timestamp } = req.body;
        console.log('Received Webhook:', req.body);


        res.json({ success: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};


export const processPayload = async (payload: any, user: any) => {
    if (!payload.changedTablesById) return;

    for (const tableId in payload.changedTablesById) {
        const tableChanges = payload.changedTablesById[tableId];


        if (tableChanges.recordsById) {
            for (const recordId in tableChanges.recordsById) {
                const recordChanges = tableChanges.recordsById[recordId];


                const response = await ResponseModel.findOne({ airtableRecordId: recordId });
                if (response) {
                    console.log(`Updating record ${recordId}`);
                }
            }
        }


        if (tableChanges.destroyedRecordIds) {
            for (const recordId of tableChanges.destroyedRecordIds) {
                await ResponseModel.updateOne(
                    { airtableRecordId: recordId },
                    { deletedInAirtable: true }
                );
                console.log(`Marked record ${recordId} as deleted`);
            }
        }
    }
};
