## Installation

1. Clone the repository

2. Navigate to the project directory

```bash
cd project
```

3. Install dependencies

```bash
npm install
```

## Setup

1. Create .env file with the followings:

```bash
DATABASE_URL=./data/database.db
DISCORD_BOT_ID=your_discord_bot_id_here
GIPHY_API=your_API
DISCORD_CHANNEL_ID=your_channel_id
```

# Migrations

We can run migrations with the following command:

```bash
npm run migrate:latest
```

Update types:

```bash
npm run gen:types
```

## Usage

1. Start the app

```bash
npm run dev
```

2. Use POSTMAN/INSOMNIA

- GET SPRINT : http://localhost:3002/sprints
- GET SPRINT BY ID: http://localhost:3002/sprints/:id
- POST SPRINT: http://localhost:3002/sprints
- PATCH SPRINT: http://localhost:3002/sprints/:id

- GET TEMPLATES: http://localhost:3002/templates
- POST TEMPLATES: http://localhost:3002/templates
- PATCH TEMPLATES: http://localhost:3002/templates/:id

- GET STUDENTS: http://localhost:3002/students
- POST STUDENTS: http://localhost:3002/students

- GET MESSAGES: http://localhost:3002/messages
- POST MESSAGES: http://localhost:3002/messages

```bash
{

      "studentId": 3,
      "sprintId": 3
      ,
      "templateId": null,
      "url": null
}
```

- GET MESSAGES FOR A SPESIFIC USER: http://localhost:3002/messages?username=?
- GET MESSAGES FOR A SPESIFIC SPRINT: http://localhost:3002/messages?sprint=?
