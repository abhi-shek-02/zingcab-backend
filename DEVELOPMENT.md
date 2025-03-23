
# ZingCab Backend Development Guide

This guide provides instructions for setting up and developing the ZingCab backend.

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/zingcabBackendLovable.git
   cd zingcabBackendLovable
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   ```
   cp .env.example .env
   ```
   Then edit `.env` with your specific configuration.

4. Initialize database:
   ```
   node src/backend/scripts/init-db.js
   ```
   This will check if required tables exist in your Supabase instance.

## Database Setup

If you're starting fresh with Supabase:

1. Create a new project in Supabase
2. Go to SQL Editor and run the SQL statements from `src/backend/scripts/sql/schema.sql`
3. Update your `.env` file with the Supabase URL and service role key

## Development

Start the development server:
```
npm run dev
```

The server will run at http://localhost:5000 by default.

## Testing API Endpoints

You can test the API endpoints using the curl commands provided in the README.md file.

## Code Structure

- `src/backend/controllers/`: Request handlers
- `src/backend/services/`: Business logic
- `src/backend/middlewares/`: Express middlewares
- `src/backend/routes/`: API route definitions
- `src/backend/utils/`: Utility functions
- `src/backend/config/`: Configuration files
- `src/backend/scripts/`: Utility scripts

## Logging

Logs are handled by Winston and are output to the console by default. In production, consider setting up additional transports for log storage.

## Error Handling

All API responses follow a standard format:
- Success responses: `{ success: true, message: String, data: Object }`
- Error responses: `{ success: false, message: String, errors: Array }`

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Commit your changes: `git commit -m "Add some feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Create a pull request
