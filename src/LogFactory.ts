import * as pino from 'pino';
export class LogFactory {

  public static build = (name: string): pino.BaseLogger => {
    return pino({ name });
  }
}
