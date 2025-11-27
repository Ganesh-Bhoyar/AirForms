import express from 'express';
import { createForm, getMyForms, getFormById, updateForm, deleteForm } from '../controllers/formController';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

// Public route
router.get('/:formId', getFormById);

// Protected routes
router.use(requireAuth);
router.post('/', createForm);
router.get('/', getMyForms);
router.put('/:formId', updateForm);
router.delete('/:formId', deleteForm);

export default router;
