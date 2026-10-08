import express from 'express';
import { createNewPlaylist, getPlaylist } from '../controllers/playlistController.js';

const router = express.Router();

router.post('/', createNewPlaylist);
router.get('/:playlistCode', getPlaylist);

export default router;
