import * as dotenv from 'dotenv';
dotenv.config();

import * as express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as ChaoticResponse from 'connect-chaotic-response';
import config from './config';

const app = express();
app.disable('x-powered-by');

const chaoticResponse = new ChaoticResponse({ chaotic: { mode: config.proxy.chaosMode } });

const proxyOptions = {
  target: config.proxy.target,
  changeOrigin: true,
  pathRewrite: {
    '^/proxy/': '/', // remove base path
  },
  onProxyReq: (_proxyReq, req: express.Request) => {
    const log = {
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: req.body,
      query: req.query,
    };
    console.log(log);
  },
};

app.use(chaoticResponse.middleware); // chaotic middleware should be first!

// Proxy
app.use('/proxy', createProxyMiddleware(proxyOptions));

app.listen(config.server.port);
console.log(`Server is up, listening on port ${config.server.port}`);
