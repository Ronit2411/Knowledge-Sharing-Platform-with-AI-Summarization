import Joi from "joi";

// Custom error messages
const customMessages = {
  "string.empty": "{{#label}} cannot be empty",
  "string.min": "{{#label}} must be at least {{#limit}} characters long",
  "string.max": "{{#label}} must not exceed {{#limit}} characters",
  "string.email": "{{#label}} must be a valid email address",
  "any.required": "{{#label}} is required",
  "object.unknown": "{{#label}} is not allowed",
};

// Validation schemas
const schemas = {
  signup: Joi.object({
    name: Joi.string().min(2).max(100).required().messages(customMessages),
    email: Joi.string().email().required().messages(customMessages),
    password: Joi.string().min(6).max(100).required().messages(customMessages),
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages(customMessages),
    password: Joi.string().required().messages(customMessages),
  }),

  article: Joi.object({
    title: Joi.string().min(1).max(255).required().messages(customMessages),
    content: Joi.string().min(10).max(10000).required().messages(customMessages),
  }),

  articleUpdate: Joi.object({
    title: Joi.string().min(1).max(255).optional().messages(customMessages),
    content: Joi.string().min(10).max(10000).optional().messages(customMessages),
  }).min(1), // At least one field must be provided

  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages(customMessages),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(20)
      .messages(customMessages),
  }),

  search: Joi.object({
    q: Joi.string().min(1).max(100).required().messages(customMessages),
    page: Joi.number().integer().min(1).default(1).messages(customMessages),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(50)
      .default(20)
      .messages(customMessages),
  }),
};

// Validation middleware factory
const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({
        error: "Validation schema not found",
        message: "Internal server error",
      });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        error: "Validation failed",
        message: "Please check your input and try again",
        details: errorDetails,
      });
    }

    // Replace req.body with validated data
    req.body = value;
    next();
  };
};

// Query validation middleware
const validateQuery = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({
        error: "Validation schema not found",
        message: "Internal server error",
      });
    }

    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        error: "Query validation failed",
        message: "Please check your query parameters and try again",
        details: errorDetails,
      });
    }

    // Replace req.query with validated data
    req.query = value;
    next();
  };
};

// Params validation middleware
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        error: "Parameter validation failed",
        message: "Please check your parameters and try again",
        details: errorDetails,
      });
    }

    // Replace req.params with validated data
    req.params = value;
    next();
  };
};

// Common parameter schemas
const paramSchemas = {
  id: Joi.object({
    id: Joi.number().integer().min(1).required().messages(customMessages),
  }),
};

export default {
  validate,
  validateQuery,
  validateParams,
  paramSchemas,
  schemas,
};
