import { extname } from 'path';
import { createReadStream } from 'fs';
export const serveStatic = (req, res) => {
  let filePath = '.' + req.url;
  if (filePath == './') filePath = './index.html';

  const ext = extname(filePath);
  let contentType = 'text/html';
  switch (ext) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.wav':
      contentType = 'audio/wav';
      break;
  }
  try {
    console.log('serving request for ', filePath);
    const rs = createReadStream(filePath);
    rs.pipe(res);
  } catch (e) {
    if (e.code == 'ENOENT') {
      res.writeHead(404, { 'Content-Type': contentType });
      res.write('404 Not found');
      res.end();
    } else {
      console.log(e);
      res.writeHead(500, { 'Content-Type': contentType });
      res.write('500 Error');
      res.end();
    }
  }
};
