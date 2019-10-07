export class NotFoundException extends Error {
  public constructor(public readonly msg: string = 'NotFoundException thrown') {
    super(msg);
  }
}
