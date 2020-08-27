import * as express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as ChaoticResponse from 'connect-chaotic-response';
import config from './config';

const app = express();

// Create a new chaoticResponse, optionaly with options
const chaoticResponse = new ChaoticResponse(config.chaotic);

const proxyOptions = {
  target: 'https://developer.api.autodesk.com/',
  changeOrigin: true,
  pathRewrite: {
    '^/proxy/schedule': '/construction/schedule', // remove base path
  },
  onProxyReq: (_proxyReq, req: express.Request, _res) => {
    const log = {
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: req.body,
      query: req.query
    };
    console.log(log);
  }
};

app.use(chaoticResponse.middleware); // this middleware should be first!

// Proxy
app.use('/proxy', createProxyMiddleware(proxyOptions));

app.listen(config.server.port);
console.log(`Server is up, listening on port ${config.server.port}`);
