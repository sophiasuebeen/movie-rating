# 🎬 Movie Rating

A bucket-first movie ranking application that helps you organize and rank movies without complicated scoring systems. Add movies, choose a preference bucket, then compare within that bucket to build your perfect ranking.

## Features

✅ **Bucket-first ranking** - Categorize movies into "I liked it", "It was fine", or "I didn't like it"  
✅ **Within-bucket comparison** - Simple pairwise comparisons to find the perfect ranking order  
✅ **Automatic scoring** - Movies get approximate 1-10 scores based on their position and bucket  
✅ **Share rankings** - Generate public links to share your movie rankings  
✅ **Zero account required** - Works instantly without signing up  
✅ **Responsive design** - Works on desktop and mobile  

## Tech Stack

- **Frontend**: React 18 + Vite + CSS
- **Backend**: Node.js + Express + Prisma ORM
- **Database**: SQLite (development) / PostgreSQL (production)
- **Validation**: Zod
- **Containerization**: Docker + docker-compose
- **Testing**: Vitest (unit) + Playwright (E2E)

## Quick Start

### Option 1: Using npm scripts (recommended for development)

```bash
# Install all dependencies
npm install

# Start both frontend and backend concurrently
npm run dev
```

The frontend will be available at `http://localhost:5173`  
The backend will be available at `http://localhost:4000`

### Option 2: Manual setup (if you want to control them separately)

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm run dev
```

### Option 3: Using Docker

```bash
# Build and start all services
docker-compose up

# Or rebuild after making changes
docker-compose up --build
```

Frontend: `http://localhost`  
Backend: `http://localhost:4000`

## Development

### Environment Setup

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Configure the variables:
```env
PORT=4000
NODE_ENV=development
JWT_SECRET=your-development-secret
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Database Setup

Initialize the database:

```bash
cd server
npm run prisma:migrate
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

### Building for Production

```bash
# Build the frontend
npm run build

# Start the backend in production
NODE_ENV=production npm start
```

## Project Structure

```
movie-rating/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx        # Main app component with routing
│   │   └── main.jsx       # React entry point
│   └── index.html
├── server/                 # Node.js + Express backend
│   ├── src/
│   │   ├── index.js       # Express app and routes
│   │   ├── config.js      # Configuration management
│   │   ├── middleware.js  # CORS, validation, error handling
│   │   └── validation.js  # Zod schemas
│   └── prisma/
│       └── schema.prisma  # Database schema
├── docker-compose.yml     # Docker composition file
├── .env.example           # Environment variables template
└── README.md              # This file
```

## API Endpoints

### Lists
- `POST /api/lists` - Create a new movie list
- `GET /api/lists/:listId/movies` - Get all movies in a list
- `POST /api/lists/:listId/share` - Generate a share link

### Movies
- `POST /api/lists/:listId/movies` - Add a new movie to a list
- `POST /api/lists/:listId/movies/:movieId/compare` - Compare two movies

### Public
- `GET /api/public/:shareSlug` - View a shared ranking
- `GET /api/health` - Health check endpoint

## Deployment

### Manual Deployment

1. Install Node.js 20+ on your server
2. Clone the repository
3. Install dependencies: `npm install`
4. Build the frontend: `npm run build`
5. Start the backend: `NODE_ENV=production npm start`

### Docker Deployment

```bash
docker-compose -f docker-compose.yml up -d
```

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your-super-secret-key-minimum-32-chars
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
PORT=4000
```

## Performance Considerations

- Database indexes are automatically created by Prisma
- Frontend assets are cached by nginx with 1-year expiration
- API responses are optimized for minimal payload size
- Bucket-first comparison reduces decision complexity

## Security

- Input validation on all endpoints using Zod
- CORS properly configured for allowed origins
- Environment variables for secrets (never committed)
- SQL injection prevention via Prisma ORM
- XSS protection via React's built-in escaping

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Android Chrome 90+)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## License

MIT - Feel free to use this project for personal or commercial purposes.

## Roadmap

- [ ] User authentication (email/password + OAuth)
- [ ] User accounts and rankings history
- [ ] Social features (follow users, see friend rankings)
- [ ] Movie metadata (posters, descriptions, ratings)
- [ ] Advanced analytics and insights
- [ ] Mobile app (React Native)
- [ ] Recommendation engine
- [ ] Payment/subscription features

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with ❤️ for movie lovers everywhere.
