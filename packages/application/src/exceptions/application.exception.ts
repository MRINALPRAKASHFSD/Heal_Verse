export class ApplicationException extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'ApplicationException';
  }
}

export class ValidationException extends ApplicationException {
  constructor(message: string, public readonly issues: string[]) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationException';
  }
}

export class NotFoundException extends ApplicationException {
  constructor(message: string) {
    super(message, 'NOT_FOUND');
    this.name = 'NotFoundException';
  }
}

export class ConflictException extends ApplicationException {
  constructor(message: string) {
    super(message, 'CONFLICT');
    this.name = 'ConflictException';
  }
}

export class UnauthorizedException extends ApplicationException {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedException';
  }
}