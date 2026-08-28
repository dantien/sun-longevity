module.exports = {
  apps: [
    {
      name: "sun-helse",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3011",
      cwd: "/home/terjep/SUN_OS/projects/11_sun_helse",
      env: {
        NODE_ENV: "production",
        PORT: 3011
      }
    }
  ]
};
