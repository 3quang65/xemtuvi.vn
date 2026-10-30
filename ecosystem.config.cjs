module.exports = {
  apps: [
    {
      name: 'xemtuvi',
      cwd: __dirname,
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000 -H 127.0.0.1',
      env: { NODE_ENV: 'production', SITE_NOINDEX: process.env.SITE_NOINDEX || '1' },
      max_memory_restart: '600M',
    },
  ],
};
