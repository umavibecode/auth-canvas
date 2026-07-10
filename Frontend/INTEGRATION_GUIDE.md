# Auth Canvas - Integrated Project

This project integrates **auth-canvas** (frontend) and **auth-mastery** (backend) into a unified application.

## Project Structure

```
auth-canvas/
├── src/
│   ├── routes/
│   │   ├── __root.tsx          # Root layout
│   │   ├── index.tsx           # Home page
│   │   └── api/
│   │       └── auth/           # Authentication API routes
│   │           ├── signup.ts   # POST /api/auth/signup
│   │           ├── login.ts    # POST /api/auth/login
│   │           ├── profile.ts  # GET /api/auth/profile
│   │           ├── github.ts   # GET /api/auth/github (OAuth)
│   │           └── github-callback.ts  # GET /api/auth/github-callback
│   ├── components/             # React components
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/
│   │   ├── user-db.ts         # User database (in-memory, replace with DB)
│   │   ├── utils.ts           # Utilities
│   │   └── error-capture.ts   # Error tracking
│   ├── server.ts              # SSR error handler
│   └── styles.css             # Global styles
├── package.json               # Dependencies (frontend + backend)
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── .env                      # Environment variables (local)
├── .env.example              # Environment variables (template)
└── .gitignore
```

## Features

### Backend API Endpoints

#### Authentication Routes

1. **Signup** - Create a new user account
   - `POST /api/auth/signup`
   - Body: `{ email: string, password: string }`

2. **Login** - Authenticate with email and password
   - `POST /api/auth/login`
   - Body: `{ email: string, password: string }`
   - Returns: `{ token, user, message }`

3. **GitHub OAuth** - Redirect to GitHub for authentication
   - `GET /api/auth/github`
   - Initiates GitHub OAuth flow

4. **GitHub Callback** - Handle GitHub OAuth callback
   - `GET /api/auth/github-callback`
   - Automatically redirects to frontend with token

5. **Profile** - Get authenticated user profile
   - `GET /api/auth/profile`
   - Headers: `Authorization: Bearer <token>`
   - Returns: `{ user: { id, email, name, githubId } }`

### Frontend

- React 19 with TanStack Start
- TailwindCSS styling
- shadcn/ui components
- React Router for navigation
- React Hook Form for forms
- Zod for validation

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with:
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` from GitHub OAuth app
- `JWT_SECRET` - a strong random string for JWT signing
- `PORT` - server port (default: 5173)
- `FRONTEND_URL` - frontend URL for OAuth callbacks

### 3. Create GitHub OAuth App (Optional)

1. Go to GitHub Settings > Developer settings > OAuth apps
2. Create a new OAuth application
3. Set Authorization callback URL to: `http://localhost:5173/api/auth/github-callback`
4. Copy Client ID and Client Secret to `.env`

### 4. Run Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

Output will be in `dist/`

## API Usage Examples

### Signup

```bash
curl -X POST http://localhost:5173/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:5173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Get Profile

```bash
curl -X GET http://localhost:5173/api/auth/profile \
  -H "Authorization: Bearer <your_token>"
```

## Technology Stack

### Frontend
- **React 19** - UI library
- **TanStack Start** - Meta-framework
- **TailwindCSS** - Styling
- **React Router** - Routing
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **shadcn/ui** - Component library

### Backend
- **Express.js** - HTTP server (integrated via TanStack Start)
- **JWT (jsonwebtoken)** - Token generation and verification
- **bcryptjs** - Password hashing
- **Passport.js** - OAuth integration (prepared)
- **CORS** - Cross-origin support

### Development
- **TypeScript** - Type safety
- **Vite** - Build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Database

Currently uses in-memory storage. To use a real database:

1. Update `src/lib/user-db.ts` to connect to your database (PostgreSQL, MongoDB, etc.)
2. Update the `User` interface as needed
3. Implement proper database queries

## Security Considerations

⚠️ **Production Checklist:**

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Use environment variables for all secrets
- [ ] Replace in-memory database with a persistent database
- [ ] Add rate limiting to API routes
- [ ] Add CSRF protection
- [ ] Use HTTPS in production
- [ ] Implement proper error handling
- [ ] Add input validation and sanitization
- [ ] Store passwords securely (already using bcryptjs)
- [ ] Add logging and monitoring
- [ ] Configure CORS properly for your domain

## Troubleshooting

### Issue: GitHub OAuth not working
- Verify `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are correct
- Check Authorization callback URL matches in GitHub app settings
- Ensure `FRONTEND_URL` is correctly set

### Issue: API routes not working
- Check `.env` file exists and has required variables
- Verify routes are in `src/routes/api/` directory
- Check browser console for CORS errors

### Issue: Build errors
- Delete `node_modules` and run `npm install` again
- Clear build cache: `rm -rf dist`
- Check TypeScript errors: `npm run lint`

## Next Steps

1. Customize the authentication flow for your needs
2. Add database integration (PostgreSQL, MongoDB, etc.)
3. Implement additional OAuth providers (Google, Discord, etc.)
4. Add email verification
5. Add password reset functionality
6. Implement role-based access control (RBAC)
7. Add audit logging
8. Set up automated testing

## Deprecated Projects

The following original projects are now integrated into `auth-canvas`:
- `auth-mastery` - Backend server (now in `src/routes/api/auth/`)
- All backend logic merged into TanStack Start API routes

To completely remove the old separate projects, you can delete the `auth-mastery` folder after confirming everything works in the integrated project.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API endpoint documentation
3. Check environment variables are set correctly

---

**Version:** 1.0.0  
**Last Updated:** 2025-07-10
