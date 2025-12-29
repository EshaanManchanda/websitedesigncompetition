module.exports = {
  apps: [{
    name: 'kids-competition-api',
    script: '../../backend/src/server.js',
    instances: 2,
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 5050
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    error_file: '../../backend/logs/err.log',
    out_file: '../../backend/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    listen_timeout: 3000,
    kill_timeout: 5000
  }]
};
