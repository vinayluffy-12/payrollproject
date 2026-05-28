require('dotenv').config();
const { server } = require('./app');
const { sequelize } = require('./models');
const seedDatabase = require('./utils/seeder');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Authenticate and sync database
    await sequelize.authenticate();
    console.log('Database connection authenticated.');
    
    // Sync models
    await sequelize.sync({ force: false });
    console.log('Database synchronized.');

    // Seed database if empty
    await seedDatabase();

    server.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  PayrollOS API Gateway running on port ${PORT}`);
      console.log(`  Real-time Socket.io active`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

