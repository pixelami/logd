import { request } from 'http';

let req = request('http://localhost:2022/log', { method: 'POST' });
req.write(JSON.stringify({ type: 'log', args: [1] }));
req.end();

req = request('http://localhost:2022/batch', { method: 'POST' });
req.write(
  JSON.stringify([
    { type: 'log', args: ['a', 2] },
    { type: 'log', args: ['b', 3] },
    { type: 'log', args: ['c', 4] },
    { type: 'log', args: ['d', 5] },
    { type: 'log', args: ['e', 6] },
    { type: 'log', args: ['addd', 7] },
    { type: 'log', args: ['axz', 8] },
  ]),
);
req.end();
