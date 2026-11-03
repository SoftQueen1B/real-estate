export type FieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  status: number;
  errors: FieldErrors;
  constructor(message: string, status: number, errors: FieldErrors = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
  get isValidation() {
    return this.status === 422;
  }
  get isUnauthorized() {
    return this.status === 401 || this.status === 419;
  }
  get isForbidden() {
    return this.status === 403;
  }
}
