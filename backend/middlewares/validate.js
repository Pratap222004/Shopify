function validate(schema, prop = 'body') {
  // Placeholder: schema must have a 'validate' method
  return (req, res, next) => {
    const { error } = schema.validate(req[prop]);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
}

module.exports = { validate };


