import { readFileSync } from 'fs';
const browserClientTemplate = readFileSync('./template/browser.js').toString();
export const getBrowserClient = (ipAddress: string) => {
  //browserClientTemplate.replace(/\$\{([^\}]*)\}/, ipAddress);
  browserClientTemplate.replace('${host}', ipAddress);
};
