import { resolve } from 'path';
import { appendFile } from 'fs';

export class LogWriter {
  public static readonly LogDirectory = '/Volumes/XF01/dev/dazn/logs/';
  private logPath: string;
  setLogPath(name: string) {
    this.logPath = resolve(LogWriter.LogDirectory, name);
  }

  appendBatch(data) {
    appendFile(this.logPath, data, (err) => {
      if (err) console.log(err);
      console.log('batch appended:', this.logPath);
    });
  }
}
