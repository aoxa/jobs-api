const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong'
  }
  if(err.name === 'ValidationError') {
    customError.statusCode = StatusCodes.BAD_REQUEST
    customError.msg = Object.values(err.errors).map((item)=>item.message).join(', ')
  }

  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
