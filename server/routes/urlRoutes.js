import express from 'express';
import { shortenUrl, getUrlStats } from '../controllers/urlController.js';

const router = express.Router();

router.post('/', shortenUrl);
router.get('/:shortCode/stats', getUrlStats);

export default router;
