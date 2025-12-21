require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const { testConnection: testCloudinary } = require('./config/cloudinary');

/**
 * Server Entry Point
 * Starts the Express server and connects to MongoDB
 */

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to MongoDB
connectDB()
  .then(async () => {
    // Test Cloudinary connection
    await testCloudinary();

    // Start server
    const server = app.listen(PORT, () => {
      console.log('========================================');
      console.log(`🚀 Server running in ${NODE_ENV} mode`);
      console.log(`📡 Listening on port ${PORT}`);
      console.log(`🌐 API URL: http://localhost:${PORT}/api`);
      console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
      console.log('========================================');
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      console.log('\n⏳ Received shutdown signal, closing server gracefully...');

      server.close(() => {
        console.log('✅ Server closed');
        console.log('🔌 Closing database connection...');

        const mongoose = require('mongoose');
        mongoose.connection.close(false, () => {
          console.log('✅ Database connection closed');
          process.exit(0);
        });
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        console.error('❌ Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    // Listen for termination signals
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});
