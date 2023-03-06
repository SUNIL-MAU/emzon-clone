//Not found
const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

//Error handler

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    massage: error?.massage,
    stack: error?.stack,
  });
};

module.exports = { notFound, errorHandler };
