export class FatalException extends Error {
  public constructor(msg: string = 'Fatal Exception thrown', public readonly reason?: {}) {
    super(msg);
  }
}
