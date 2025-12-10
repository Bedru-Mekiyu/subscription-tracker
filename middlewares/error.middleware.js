const errorMiddleware = function (err, req, res) {
  let error = { ...err };
  error.message = err.message;
  console.error(err);

  if (err.name === 'CastError') {
    error = new Error('Resource not found');
    error.statusCode = 404;
  }

  if (err.code === 11000) {
    error = new Error('Duplicate field value entered');
    error.statusCode = 400;
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(val => val.message);
    error = new Error(message.join(', '));
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({ success: false, error: error.message || 'server error' })
}
export default errorMiddleware;