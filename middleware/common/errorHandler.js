
const notFound = (req, res, next) => {
  res.status(404).json({
    status: 'Not Found',
    msg: 'You requested page could not be found',
  });
  next();
};

// default error handler
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
}
export { notFound, errorHandler };