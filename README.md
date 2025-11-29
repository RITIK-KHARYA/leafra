# Leafra - AI-Powered PDF RAG System

Leafra is a Next.js application that provides a Retrieval-Augmented Generation (RAG) system for PDF documents. Users can upload PDFs, ask questions about them, and receive AI-powered responses based on the document content.

## Features

- 📄 PDF Upload and Processing
- 🤖 AI-Powered Chat Interface
- 🔍 Vector Search using Pinecone
- 🔐 Authentication (Email/Password + OAuth)
- 📊 Real-time Chat Streaming
- 🗄️ PostgreSQL Database
- ⚡ Background Job Processing with BullMQ

## Architecture

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Drizzle ORM
- **Vector Database**: Pinecone
- **AI/ML**: TogetherAI (Embeddings & Chat)
- **Queue**: BullMQ with Redis (Upstash)
- **File Upload**: UploadThing
- **Authentication**: Better-auth
- **UI**: React, Tailwind CSS, shadcn/ui

### Application Flow

1. **Authentication Flow**: User signs up/in → Better-auth → Session management
2. **Chat Creation**: User creates chat → Stored in DB → Chat page loads
3. **PDF Upload**: UploadThing → BullMQ queue → Worker processes → Pinecone embeddings
4. **Chat Flow**: User message → API route → Save to DB → Query Pinecone → Stream AI response → Save response

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Pinecone account
- TogetherAI account
- Upstash Redis account (optional but recommended)
- UploadThing account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd leafra
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Pinecone
PINECONE_API_KEY=your-pinecone-api-key

# TogetherAI
TOGETHER_AI_API_KEY=your-together-ai-api-key
TOGETHER_AI_MODEL=your-model-name

# Redis (Upstash) - Optional
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

4. Set up the database:
```bash
# Run migrations
npm run db:push
# or with drizzle-kit
npx drizzle-kit push
```

5. Start the development server:
```bash
npm run dev
# or
bun dev
```

6. Start the worker (in a separate terminal):
```bash
# Compile worker
tsc --watch ./lib/worker.ts

# Run worker (in another terminal)
bunx nodemon ./lib/worker.js
# or
bun run ./lib/worker.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
leafra/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── chat/          # Chat API
│   │   ├── messages/      # Messages API
│   │   └── uploadthing/   # File upload
│   ├── actions/           # Server actions
│   ├── chat/              # Chat pages
│   ├── dashboard/         # Dashboard page
│   └── layout.tsx         # Root layout
├── components/             # React components
│   ├── custom/            # Custom components
│   ├── ui/                # shadcn/ui components
│   └── shared/            # Shared components
├── lib/                   # Utility libraries
│   ├── auth.ts            # Authentication config
│   ├── db.ts              # Database connection
│   ├── db/
│   │   └── schema.ts      # Database schema
│   ├── env.ts             # Environment validation
│   ├── logger.ts          # Logging utility
│   ├── api-response.ts    # API response helpers
│   ├── integrations/     # Third-party integrations
│   │   ├── pinecone.ts   # Pinecone client
│   │   └── redis.ts      # Redis client
│   └── worker.ts          # Background worker
├── types/                 # TypeScript types
└── middleware.ts          # Next.js middleware
```

## API Documentation

### Authentication

All API routes (except `/api/auth/*`) require authentication via session cookie.

### Endpoints

#### POST `/api/chat`
Send a message to the chat and get an AI response.

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What is this document about?"
    }
  ],
  "chatId": "uuid-string"
}
```

**Response:** Streaming text response

#### GET `/api/messages?chatId=uuid`
Get all messages for a chat.

**Query Parameters:**
- `chatId` (required): UUID of the chat

**Response:**
```json
[
  {
    "id": 1,
    "chatId": "uuid",
    "content": "Message content",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run dev:worker` - Watch and run worker

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Zod for runtime validation
- Structured logging
- Standardized error responses

## Deployment

### Environment Variables

Ensure all required environment variables are set in your production environment. See the `.env.example` file for reference.

### Database Migrations

Run database migrations before deploying:
```bash
npx drizzle-kit push
```

### Worker Process

The worker process must be running separately in production. Consider using:
- PM2
- Docker containers
- Cloud functions
- Kubernetes jobs

### Recommended Platforms

- **Vercel** - For Next.js hosting
- **Railway** - For PostgreSQL and worker
- **Upstash** - For Redis
- **Pinecone** - For vector database

## Security

- All API routes are authenticated
- Environment variables are validated at startup
- Input validation using Zod
- SQL injection protection via Drizzle ORM
- Session-based authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

[Add your license here]

## Support

For issues and questions, please open an issue on GitHub.