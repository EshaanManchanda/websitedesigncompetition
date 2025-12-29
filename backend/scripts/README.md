# Database Migration Scripts

This directory contains database migration scripts for the Kids Web Competition backend.

## Available Scripts

### `remove-email-unique-index.js`

Removes the unique constraint from the email field in the registrations collection, allowing multiple users to register with the same email address.

**Why this is needed:**
- Parents can register multiple children using the same parent email
- Siblings can share an email address
- Teachers can register multiple students
- Same person can register for multiple categories/years

**Usage:**

```bash
# From the backend directory
node scripts/remove-email-unique-index.js
```

**What it does:**
1. Connects to MongoDB using `MONGODB_URI` from `.env`
2. Lists current indexes on the registrations collection
3. Drops the unique constraint on the `email_1` index
4. Recreates the email index without unique constraint
5. Shows final indexes and checks for duplicate emails

**Prerequisites:**
- MongoDB connection URI configured in `backend/.env`
- Node.js and npm installed
- `dotenv` and `mongoose` packages installed

**Output example:**
```
Starting database migration...

Connecting to MongoDB...
✓ Connected to MongoDB

Current indexes on registrations collection:
[
  { "v": 2, "key": { "_id": 1 }, "name": "_id_" },
  { "v": 2, "key": { "email": 1 }, "name": "email_1", "unique": true }
]

Found unique constraint on email_1 index
Dropping email_1 index...
✓ Dropped unique email_1 index

Creating non-unique email index...
✓ Created non-unique email index

Final indexes on registrations collection:
[
  { "v": 2, "key": { "_id": 1 }, "name": "_id_" },
  { "v": 2, "key": { "email": 1 }, "name": "email_1" }
]

Total registrations in database: 5
No duplicate emails found in existing registrations

✓ Migration completed successfully!

Database connection closed
```

**When to run:**
- After deploying code changes that remove email uniqueness validation
- Before attempting to register multiple users with the same email
- As part of production deployment process

**Rollback:**
If you need to restore the unique constraint:

```javascript
// In MongoDB shell or similar script
db.registrations.dropIndex("email_1");
db.registrations.createIndex({ email: 1 }, { unique: true });
```

**Note:** You cannot re-add the unique constraint if duplicate emails already exist in the database. You would need to clean up duplicates first.

## Testing After Migration

After running the migration, test that duplicate emails work:

1. **Test with curl:**
   ```bash
   # Register first user
   curl -X POST http://localhost:5050/api/registrations \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Child",
       "lastName": "One",
       "email": "parent@example.com",
       "age": "8-10",
       "school": "Test School",
       "parentName": "Parent Name",
       "parentEmail": "parent@example.com",
       "category": "8-10",
       "experience": "beginner",
       "agreeTerms": true
     }'

   # Register second user with SAME email
   curl -X POST http://localhost:5050/api/registrations \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Child",
       "lastName": "Two",
       "email": "parent@example.com",
       "age": "11-13",
       "school": "Test School",
       "parentName": "Parent Name",
       "parentEmail": "parent@example.com",
       "category": "11-13",
       "experience": "beginner",
       "agreeTerms": true
     }'
   ```

2. **Expected result:** Both requests should succeed with 201 Created

3. **Verify in database:**
   ```javascript
   // In MongoDB shell
   db.registrations.find({ email: "parent@example.com" })
   ```
   Should return 2 documents

## Troubleshooting

**Error: "E11000 duplicate key error"**
- This means the unique index still exists
- Run the migration script again
- Check MongoDB logs for index status

**Error: "Cannot connect to MongoDB"**
- Verify `MONGODB_URI` in `.env` file
- Check MongoDB server is running
- Check network connectivity

**Error: "Index not found"**
- The unique index may have already been removed
- Check current indexes: `db.registrations.getIndexes()`
- Migration is safe to run multiple times

## Additional Scripts

You can add more migration scripts to this directory as needed. Follow the same pattern:

1. Use descriptive filename (e.g., `add-submission-deadline-field.js`)
2. Include usage instructions in file header
3. Update this README with script documentation
4. Handle errors gracefully
5. Provide clear console output
6. Close database connections properly
