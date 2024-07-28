export class HttpError extends Error {
  constructor(public status: number, public message: string) {
    super(message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request') {
    super(400, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflict') {
    super(409, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = 'Internal Server Error') {
    super(500, message);
  }
}

export class NotImplementedError extends HttpError {
  constructor(message = 'Not Implemented') {
    super(501, message);
  }
}

interface DrizzleDatabaseError extends Error {
  code: string
  detail: string
  table: string
}

// Database
export class DatabaseError {
  public readonly error: DrizzleDatabaseError

  constructor(error: Error, public readonly status: number = 500) {
    this.error = error as DrizzleDatabaseError
  }

  static fromMessage(message: string, status: number) {
    return new DatabaseError(new Error(message), status)
  }

  get message() {
    switch (this.error.code) {
      case '23503': // Foreign key violation
        const match = this.error.detail.match(/Key \((.*?)\)=.*? is not present in table "(.*?)"\./)
        if (match) {
          return `${match[1]} not found`
        } else {
          return 'Foreign key violation'
        }
      default:
        return this.error.message || 'Database error'
    }
  }
}