import cache from 'memory-cache';
export const memoryCacheMiddleware = (req, res, next) => {
  const key = '__express__' + req.originalUrl || req.url;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log('this catch response',cachedResponse);
    res.send(JSON.parse(cachedResponse));
    return 0;
  }

  res.sendResponse = res.send;
  res.send = (body) => {
    // cache.put(key, body, 86400 * 1000); 
    cache.put(key, body, 1200 * 1000); 
    res.sendResponse(body);
  };

  next();
};