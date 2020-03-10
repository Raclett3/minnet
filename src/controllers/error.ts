export class ControllerError extends Error {
  readonly name = 'ControllerError';

  constructor(message: string) {
    super(message);
  }
}
