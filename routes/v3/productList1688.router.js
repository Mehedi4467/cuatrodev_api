import express from 'express';
import { verifyApiKeyUser } from '../../middleware/common/verifyApiKey.js';
import { getProductV3 } from '../../controllers/v3/controllerV31688/productList1688.js';
import { memoryCacheMiddleware } from '../../middleware/cacheMiddleware/memoryCache.js';

const router = express.Router();
router
  .route('/:api_key([A-Za-z]{10}\\d{10}[A-Za-z]{10}\\d{5}[A-Za-z]{5})')
  .all(verifyApiKeyUser, memoryCacheMiddleware)
  .get(getProductV3);
export default router;
