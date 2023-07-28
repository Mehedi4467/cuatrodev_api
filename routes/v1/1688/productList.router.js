import express from 'express';
import { getProduct } from '../../../controllers/v1/controller1688/productList.controller.js';
import { totalApiCaount } from '../../../middleware/common/apiCount.js';
import { verifyApiKeyUser } from '../../../middleware/common/verifyApiKey.js';
// import { memoryCacheMiddleware } from '../../../middleware/cacheMiddleware/memoryCache.js';
// memoryCacheMiddleware

const router = express.Router();
router
  .route('/:api_key([A-Za-z]{10}\\d{10}[A-Za-z]{10}\\d{5}[A-Za-z]{5})')
  .all(verifyApiKeyUser, totalApiCaount)
  .get(getProduct);
export default router;
