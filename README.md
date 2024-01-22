## Setup

1. Create .env file with the database connection string.

## Database

1. Run migrations with following command:

```bash
npm run migrate:latest
```

2. If you make changes to the database schema, you will need to update the types. You can do this by running the following command:

```bash
npm run gen:types
```
