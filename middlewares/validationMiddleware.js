const { body, validationResult } = require('express-validator')
const User = require('../models/User.js')
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require('../errors/customErrors.js')
const mongoose = require('mongoose')
const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg)
        if (errorMessages[0].startsWith('no job')) {
          throw new NotFoundError(errorMessages)
        }
        if (errorMessages[0].startsWith('not authorized')) {
          throw new UnauthorizedError(errorMessages)
        }
        throw new BadRequestError(errorMessages)
      }
      next()
    },
  ]
}

const validateSignupInput = withValidationErrors([
  body('username')
    .notEmpty()
    .withMessage('username is required')
    .custom(async (username) => {
      console.log(username)
      const user = await User.findOne({ username })
      console.log(user)
      if (user) {
        throw new BadRequestError('username already exsit')
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 6 })
    .withMessage('password at least 6 characters'),
])

const validateLoginInput = withValidationErrors([
  body('username').notEmpty().withMessage('username is required'),
  body('password').notEmpty().withMessage('password is required'),
])

module.exports = { validateSignupInput, validateLoginInput }
