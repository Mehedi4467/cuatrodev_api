import express from 'express';
import { postUserData } from '../../controllers/v1/userData.controllers.js';

const router = express.Router();
// router.get('/' );
router.post('/', postUserData);

export default router;