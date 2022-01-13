export class UIError extends Error {
  constructor(public readonly code: string, originalError: Error) {
    super(originalError.message);
    this.stack = originalError.stack;
  }
}