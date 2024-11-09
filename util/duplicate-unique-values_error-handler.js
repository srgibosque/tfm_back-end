const { ValidationError } = require('sequelize');

const duplicateUniqueValuesError = ((err, field, res, message) => {
  if (err instanceof ValidationError) {
    if (err.errors.some(error => error.path === field)) {
      res.status(409).json({ message });
      return true;
    }
  }
  return false;
});

module.exports = duplicateUniqueValuesError;