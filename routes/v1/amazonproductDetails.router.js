import express from 'express';
import { getProductDetails } from '../../controllers/v1/amazon.productDetails.controllers.js';
import { verifyApiKeyUser } from '../../middleware/common/verifyApiKey.js';
import { totalApiCaount } from '../../middleware/common/apiCount.js';
import { memoryCacheMiddleware } from '../../middleware/cacheMiddleware/memoryCache.js';

const router = express.Router();
router
  .route('/:api_key([A-Za-z]{10}\\d{10}[A-Za-z]{10}\\d{5}[A-Za-z]{5})')
  .all(verifyApiKeyUser, totalApiCaount)
  .get(getProductDetails);

export default router;
