module.exports = {
  apps : [{
    name: 'test-app',
    script: 'dist/main.js',

    exec_mode: 'cluster',
    instances: 4,
    autorestart: true,
    watch: false,
    max_memory_restart: '100M',

    error_file: 'pm2-logs/err.log',
    out_file: 'pm2-logs/out.log',
    // log_file: 'pm2-logs/combined.log',
    time: true
  }, {
    // script: './service-worker/',
    // watch: ['./service-worker']
  }],

  // deploy : {
  //   production : {
  //     user : 'SSH_USERNAME',
  //     host : 'SSH_HOSTMACHINE',
  //     ref  : 'origin/master',
  //     repo : 'GIT_REPOSITORY',
  //     path : 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': ''
  //   }
  // }
};
