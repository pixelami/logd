import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
const argv = await yargs(hideBin(process.argv)).argv;

import { appendFile } from 'fs';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import chalk from 'chalk';
import { getNetworkAddress } from './net.js';
import { getBrowserClient } from './create-browser-client.js';
import { serveStatic } from './static.js';
const networkAddress = getNetworkAddress();
const port = argv.port || 2022;
const clientScript = getBrowserClient(networkAddress);

interface Payload {
  type: keyof Console | 'connect';
  args: string[];
}

const pipePattern = /||([^|]+)||/;

const createHandler = (handler: (data: string) => void) => (req: IncomingMessage, res: ServerResponse) => {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    try {
      handler(data);
    } catch (e) {
      console.log(e);
    }
    res.statusCode = 204;
    res.end();
  });
};

const processPayload = ({ type, args }: Payload) => {
  switch (type) {
    case 'debug':
      const m = pipePattern.exec(args[0]);
      if (m) {
        const [, path] = m;
        streamToFile(path, args[1]);
      }
      break;
    case 'log':
      console.log(chalk.yellowBright(args.join(' ')));
      break;
    default:
      console.log(args.join(' '));
  }
};

const handleLog = (data: string) => {
  try {
    const payload = JSON.parse(data) as Payload;
    processPayload(payload);
  } catch (e) {
    console.log('unable to parse JSON');
  }
};

const handleBatch = (data: string) => {
  try {
    const batch = JSON.parse(data) as Payload[];
    batch.forEach((payload) => {
      processPayload(payload);
    });
  } catch (e) {
    console.log('unable to parse JSON');
  }
};

const streamToFile = (path: string, data: string) => {
  appendFile(path, data, (err) => {
    if (err) console.log('error');
  });
};

const logHandler = createHandler(handleLog);
const batchHandler = createHandler(handleBatch);

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method == 'POST' && req.url?.startsWith('/log')) {
    logHandler(req, res);
  } else if (req.method == 'POST' && req.url?.startsWith('/batch')) {
    batchHandler(req, res);
  } else if (req.url?.startsWith('/client')) {
    res.statusCode = 200;
    res.end(clientScript);
  } else if (req.url?.startsWith('/test')) {
    serveStatic(res, res);
  } else {
    res.statusCode = 404;
    res.end();
  }
});
server.listen(port);
console.log(`started http-log-server at http://${networkAddress}:${port}`);
