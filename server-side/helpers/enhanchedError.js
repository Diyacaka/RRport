export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    (this.details = details), (this.name = this.constructor.name);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(zodError) {
    const formatErrors = zodError.errors.map((error) => ({
      field: error.path.join("."),
      message: error.message,
    }));

    super("Validation failed", 400, formatErrors);
  }
}

export class NotFoundError extends AppError {
  constructor(resource, id) {
    super(`${resource} with id ${id} not found`, 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = `Forbidden`, details = null) {
    super(message, 403, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = `Conflict Error`, details = null) {
    super(message, 409, details);
  }
}

export class Unauthorized extends AppError {
  constructor(message = `Unauthorized`, details = null) {
    super(message, 401, details);
  }
}
