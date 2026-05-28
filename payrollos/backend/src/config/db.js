const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbDialect = process.env.DB_DIALECT || 'sqlite';

let sequelize;

if (dbDialect === 'sqlite') {
  const isVercel = process.env.VERCEL === '1';
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || (isVercel ? '/tmp/payrollos.sqlite' : './payrollos.sqlite'),
    logging: false, // Set to console.log to see SQL queries in development
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'payrollos',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: true,
      }
    }
  );
}

module.exports = sequelize;
