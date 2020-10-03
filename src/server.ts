import * as dotenv from 'dotenv';
dotenv.config();

import * as express from 'express';
import { Request, Response } from 'express';
import * as morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as ChaoticResponse from 'connect-chaotic-response';
import config from './config';

const app = express();
app.disable('x-powered-by');

const chaoticResponse = new ChaoticResponse( { mode: config.proxy.chaosMode as ChaoticResponse.Modes });

const proxyOptions = {
  target: config.proxy.target,
  changeOrigin: true,
  pathRewrite: {
    '^/proxy/': '/', // remove base path
  }
};

// chaotic middleware - this should be first!
app.use(chaoticResponse.middleware);
console.log(`Chaotic behaviour is set: Chaotic mode is ${config.proxy.chaosMode}`);

// logger
morgan.token('host', function(req: Request) {
  return req.hostname;
});

app.use(morgan('[:date[clf]] ":host :method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'));

// Proxy
app.use('/proxy', createProxyMiddleware(proxyOptions));

app.listen(config.server.port);
console.log(`Server is up, listening on port ${config.server.port}`);
