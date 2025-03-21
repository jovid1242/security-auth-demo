const ApiError = require('../exceptions/apiError')

module.exports = function (err, req, res, next) {
  console.log(err)
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors })
  }

  if (err.response && [422, 412].includes(err.response.status)) {
    return res.status(err.response.status).json({
      message: err.response.data.message,
      errors: err.response.data.errors,
    })
  }
  return res.status(500).json({
    message: 'Непредвиденная ошибка. пожалуйста обращайтесь к тех поддерже!',
  })
}
