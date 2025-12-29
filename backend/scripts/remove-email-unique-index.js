/**
 * Database Migration Script
 * Remove unique constraint from email index in registrations collection
 *
 * This script drops the unique index on the email field and recreates it
 * as a non-unique index to allow multiple registrations with the same email.
 *
 * Usage:
 *   node scripts/remove-email-unique-index.js
 *
 * Prerequisites:
 *   - MongoDB connection URI in .env file
 *   - Mongoose installed
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function migrateDatabase() {
  try {
    console.log('Starting database migration...\n');

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const collection = db.collection('registrations');

    // Get current indexes
    console.log('Current indexes on registrations collection:');
    const indexes = await collection.indexes();
    console.log(JSON.stringify(indexes, null, 2));
    console.log('');

    // Check if unique email index exists
    const emailIndexExists = indexes.some(index =>
      index.name === 'email_1' && index.unique === true
    );

    if (emailIndexExists) {
      console.log('Found unique constraint on email_1 index');

      // Drop the unique index
      console.log('Dropping email_1 index...');
      await collection.dropIndex('email_1');
      console.log('✓ Dropped unique email_1 index\n');

      // Recreate as non-unique index
      console.log('Creating non-unique email index...');
      await collection.createIndex({ email: 1 });
      console.log('✓ Created non-unique email index\n');
    } else {
      console.log('No unique constraint found on email field');
      console.log('Index may have already been updated\n');
    }

    // Verify final indexes
    console.log('Final indexes on registrations collection:');
    const finalIndexes = await collection.indexes();
    console.log(JSON.stringify(finalIndexes, null, 2));
    console.log('');

    // Count documents
    const count = await collection.countDocuments();
    console.log(`Total registrations in database: ${count}`);

    // Check for duplicate emails
    const duplicates = await collection.aggregate([
      { $group: { _id: '$email', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    if (duplicates.length > 0) {
      console.log(`\nFound ${duplicates.length} email(s) with multiple registrations:`);
      duplicates.forEach(dup => {
        console.log(`  - ${dup._id}: ${dup.count} registrations`);
      });
    } else {
      console.log('\nNo duplicate emails found in existing registrations');
    }

    console.log('\n✓ Migration completed successfully!');

  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run migration
migrateDatabase();
