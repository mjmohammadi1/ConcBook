const { DB_HOSTNAME, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
const path = require('path');

module.exports = {
  client: 'postgresql',
  connection: {
    host: DB_HOSTNAME,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.join(__dirname, 'migrations'),
  },
  seeds: {
    directory: path.join(__dirname, 'seeds'),
  },
};
