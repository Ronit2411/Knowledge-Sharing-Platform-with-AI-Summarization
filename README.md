# Knowledge Sharing Platform with AI Summarization

A full-stack web application that allows users to create, manage, and share knowledge articles with AI-powered summarization capabilities.

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Article Management**: Create, read, update, and delete knowledge articles
- **AI Summarization**: Generate AI-powered summaries using free APIs
- **Version History**: Track article edit history with revision management
- **Responsive Design**: Modern UI built with Next.js and Tailwind CSS

## 🏗️ Project Structure

```
Knowledge-Sharing-Platform-with-AI-Summarization/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Authentication & validation
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions
│   │   └── app.js           # Main server file
│   ├── database/            # Database schema & migrations
│   ├── package.json
│   └── .env.example
├── frontend/                # Next.js React application
│   ├── src/
│   │   ├── app/             # Next.js 13+ app directory
│   │   ├── components/      # Reusable React components
│   │   ├── lib/             # Utility functions
│   │   └── styles/          # CSS styles
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **CORS**: Express CORS middleware

### Frontend
- **Framework**: Next.js 13+ with App Router
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Authentication**: HTTP-only cookies

### AI Integration
- **API**: Hugging Face Inference API (Free tier)
- **Caching**: Database-stored summaries

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd Knowledge-Sharing-Platform-with-AI-Summarization
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database and API credentials
npm run db:setup
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your backend API URL
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/knowledge_platform
JWT_SECRET=your-super-secret-jwt-key
HUGGING_FACE_API_KEY=your-hugging-face-api-key
NODE_ENV=development
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Articles Table
```sql
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Article Revisions Table
```sql
CREATE TABLE article_revisions (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Article Summaries Table
```sql
CREATE TABLE article_summaries (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Articles
- `GET /articles` - Get all articles
- `POST /articles` - Create new article
- `GET /articles/:id` - Get article by ID
- `PUT /articles/:id` - Update article
- `DELETE /articles/:id` - Delete article
- `POST /articles/:id/summary` - Generate AI summary

### Article History
- `GET /articles/:id/revisions` - Get article revision history

## 🎯 Features in Detail

### 1. User Authentication
- Secure password hashing with bcrypt
- JWT token-based authentication
- HTTP-only cookies for security
- Protected routes and middleware

### 2. Article Management
- Full CRUD operations for articles
- Rich text content support
- Author attribution and timestamps
- Search and filtering capabilities

### 3. AI Summarization
- Integration with Hugging Face Inference API
- Automatic summary generation
- Caching to avoid duplicate API calls
- Error handling for API failures

### 4. Version History
- Automatic revision tracking on article updates
- Complete edit history with timestamps
- Author-only access to revision history
- Raw content display for previous versions

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, Railway, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.