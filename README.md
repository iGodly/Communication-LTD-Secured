# Communication_LTD Information System

A secure web-based information system for Communication_LTD, built with Node.js, Express, React, and MySQL.

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Project Structure

```
communication-ltd/
├── backend/           # Node.js + Express server
├── frontend/          # React client
└── package.json       # Root package.json
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```
3. Set up environment variables:
   - Create `.env` file in the backend directory
   - Create `.env` file in the frontend directory
4. Set up MySQL database (see backend/README.md for details)
5. Start the development servers:
   ```bash
   npm start
   ```

## Development

- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:3000

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- SQL injection prevention
- XSS protection
- Rate limiting
- Input validation
- Secure session management

## License

ISC 