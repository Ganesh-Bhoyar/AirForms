import express from 'express';
import { getBases, getTables } from '../controllers/airtableController';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.use(requireAuth);

router.get('/bases', getBases);
router.get('/bases/:baseId/tables', getTables);

export default router;
