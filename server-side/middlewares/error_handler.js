import {
  AppError,
  NotFoundError,
  ValidationError,
} from "../helpers/enhanchedError.js";
import { ZodError } from "zod";

export function errorHandler(err, req, res, next) {
  console.error(`Error occured`, err);

  if (err instanceof ZodError) {
    const validationError = new ValidationError(err);
    return res.status(validationError.statusCode).json({
      // success : false,
      error: {
        message: validationError.message,
        details: validationError.details,
      },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      // success: false,
      error: {
        message: err.message,
        details: err.details,
      },
    });
  }

      if (err.code === '23505') { 
      return res.status(409).json({
        // success: false,
        error: {
          message: 'Duplicate entry',
          details: err.details || 'A record with this data already exists',
          // timestamp: new Date().toISOString()
        }
      });
    }

  return res.status(500).json({
    // succes: false,
    error: {
      message: `Internal Server Error`,
    },
  });
}
