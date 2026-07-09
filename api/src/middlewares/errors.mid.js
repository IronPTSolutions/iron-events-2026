const createHttpError = require('http-errors');

module.exports.notFound = (req, res, next) => {
  next(createHttpError(404, 'Route not found'));
}

module.exports.globalHandler = (error, req, res, next) => {
  if (!error.status) error = createHttpError(500, error);

  const data = {
    message: error.message
  };

  res.status(error.status).json(data);
}
