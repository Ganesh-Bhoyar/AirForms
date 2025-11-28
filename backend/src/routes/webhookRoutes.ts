import express from 'express';
import { handleWebhook } from '../controllers/webhookController';

const router = express.Router();

router.post('/airtable', handleWebhook);

export default router;
