export default {
  server: {
    port: process.env.SERVER_PORT ?? 5000,
  },
  proxy: {
    target: process.env.PROXY_TARGET,
    chaosMode: process.env.PROXY_CHAOS_MODE ?? 'optimistic',
  },
};
