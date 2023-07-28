import express from 'express';
import { getProductList } from '../../controllers/v1/amazon.ProductListcontrollers.js';
import { verifyApiKeyUser } from '../../middleware/common/verifyApiKey.js';
import { memoryCacheMiddleware } from '../../middleware/cacheMiddleware/memoryCache.js';
import { totalApiCaount } from '../../middleware/common/apiCount.js';

const router = express.Router();
router
  .route('/:api_key([A-Za-z]{10}\\d{10}[A-Za-z]{10}\\d{5}[A-Za-z]{5})')
  .all(verifyApiKeyUser, totalApiCaount)
  .get(getProductList);

export default router;
