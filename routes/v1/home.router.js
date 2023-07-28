import express from 'express';
const router = express.Router();
import { getHomeData } from '../../controllers/v1/home.controllers.js';

router.route('/').get(getHomeData);

// export {
//     router,
// }
export default router;