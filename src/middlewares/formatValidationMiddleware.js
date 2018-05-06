const { validationResult } = require('express-validator/check');

function formatValidationMiddleware(req, res, next) {
  const errors = validationResult(req).formatWith(({ msg, ...rest }) => ({ ...rest, message: msg }));

  if (errors.isEmpty()) {
    next();
  } else {
    return res.status(422).json({ errors: errors.array() });
  }
};

module.exports = formatValidationMiddleware;