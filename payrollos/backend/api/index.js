const { app } = require('../src/app');
const { sequelize } = require('../src/models');
const seedDatabase = require('../src/utils/seeder');

let isDbInitialized = false;

// Middleware to ensure DB connection is ready on first serverless function invoke
app.use(async (req, res, next) => {
  if (!isDbInitialized) {
    try {
      await sequelize.authenticate();
      console.log('Serverless database connection authenticated.');
      await sequelize.sync({ force: false });
      console.log('Serverless database synchronized.');
      await seedDatabase();
      isDbInitialized = true;
    } catch (error) {
      console.error('Failed to initialize database in serverless function:', error);
    }
  }
  next();
});

module.exports = app;
