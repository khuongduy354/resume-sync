export enum ErrorType {
  // 4xx Client Errors
  ValidationError = "ValidationError", // 400 - Invalid request body/params (Zod validation)
  NotFoundError = "NotFoundError", // 404 - Resource not found
  UnauthorizedError = "UnauthorizedError", // 401 - Invalid authentication
  ForbiddenError = "ForbiddenError", // 403 - User not allowed to access resource
  ConflictError = "ConflictError", // 409 - Resource already exists
  BadRequestError = "BadRequestError", // 400 - Generic bad request

  // 5xx Server Errors
  DatabaseError = "DatabaseError", // 500 - Database operation failed
  StorageError = "StorageError", // 500 - File storage operation failed
  InternalServerError = "InternalServerError", // 500 - Generic server error
  ConfigurationError = "ConfigurationError", // 500 - Missing environment variables
}

export class AppError extends Error {
  errorType: ErrorType;
  statusCode: number;

  constructor(message: string, errorType: ErrorType, statusCode?: number) {
    super(message);
    this.name = "AppError";
    this.errorType = errorType;
    this.statusCode = statusCode || this.getDefaultStatusCode(errorType);
  }

  private getDefaultStatusCode(errorType: ErrorType): number {
    switch (errorType) {
      case ErrorType.ValidationError:
      case ErrorType.BadRequestError:
        return 400;
      case ErrorType.UnauthorizedError:
        return 401;
      case ErrorType.ForbiddenError:
        return 403;
      case ErrorType.NotFoundError:
        return 404;
      case ErrorType.ConflictError:
        return 409;
      case ErrorType.DatabaseError:
      case ErrorType.StorageError:
      case ErrorType.InternalServerError:
      case ErrorType.ConfigurationError:
      default:
        return 500;
    }
  }
}

// Specific error classes for better type safety
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, ErrorType.ValidationError);
    if (details) {
      this.message = `${message}: ${JSON.stringify(details)}`;
    }
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, ErrorType.NotFoundError);
  }
}

export class ConflictError extends AppError {
  constructor(resource: string) {
    super(`${resource} already exists`, ErrorType.ConflictError);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access") {
    super(message, ErrorType.UnauthorizedError);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access forbidden") {
    super(message, ErrorType.ForbiddenError);
  }
}

export class DatabaseError extends AppError {
  constructor(operation: string, originalError?: Error) {
    const message = `Database operation failed: ${operation}`;
    super(
      originalError ? `${message} - ${originalError.message}` : message,
      ErrorType.DatabaseError
    );
  }
}

export class StorageError extends AppError {
  constructor(operation: string, originalError?: Error) {
    const message = `Storage operation failed: ${operation}`;
    super(
      originalError ? `${message} - ${originalError.message}` : message,
      ErrorType.StorageError
    );
  }
}

export class ConfigurationError extends AppError {
  constructor(configItem: string) {
    super(
      `Configuration missing or invalid: ${configItem}`,
      ErrorType.ConfigurationError
    );
  }
}

// Utility function to handle errors in controllers
export function handleControllerError(
  error: unknown,
  operation: string
): { message: string; status: number } {
  console.error(`Error in ${operation}:`, error);

  if (error instanceof AppError) {
    return {
      message: error.message,
      status: error.statusCode,
    };
  }

  // Handle Zod validation errors
  if (
    error &&
    typeof error === "object" &&
    "name" in error &&
    error.name === "ZodError"
  ) {
    const zodError = error as any;
    return {
      message: `Validation error: ${
        zodError.errors
          ?.map((e: any) => `${e.path.join(".")}: ${e.message}`)
          .join(", ") || "Invalid input"
      }`,
      status: 400,
    };
  }

  // Generic error handling
  return {
    message: "Internal server error",
    status: 500,
  };
}
