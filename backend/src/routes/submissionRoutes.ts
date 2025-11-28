import express from 'express';
import { submitForm, getResponses } from '../controllers/submissionController';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/:formId', submitForm);
router.get('/:formId', requireAuth, getResponses);

export default router;
