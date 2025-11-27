import express from 'express';
import { login, callback, me, logout } from '../controllers/authController';

const router = express.Router();

router.get('/airtable', login);
router.get('/airtable/callback', callback);
router.get('/me', me);
router.post('/logout', logout);

export default router;
