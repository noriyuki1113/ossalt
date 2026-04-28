module.exports = {
  apps: [
    {
      name: "ossalt-worker",
      script: "src/scheduler.mjs",
      cwd: "/opt/ossalt-worker",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        // 環境変数は /opt/ossalt-worker/.env に記述
      },
      max_memory_restart: "200M",
      restart_delay: 5000,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
