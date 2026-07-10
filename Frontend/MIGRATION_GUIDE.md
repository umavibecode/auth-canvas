# Migration Guide: auth-canvas + auth-mastery Integration

This guide helps you migrate from separate frontend (auth-canvas) and backend (auth-mastery) projects to a unified integrated project.

## What Changed?

### Backend Integration
- **Before:** Separate Node.js + Express server in `auth-mastery/`
- **After:** API routes integrated into TanStack Start in `auth-canvas/src/routes/api/`

### Project Structure
```
OLD STRUCTURE:
auth-canvas/          (frontend only)
auth-mastery/         (backend only)

NEW STRUCTURE:
auth-canvas/          (full-stack with integrated backend)
├── src/routes/
│   └── api/auth/      (all backend routes here)
└── package.json       (all dependencies unified)
```

## Migration Steps

### 1. Delete Old Backend Project (Optional)
Once verified the integrated project works, you can remove the separate backend:

```bash
# Backup first if needed
rm -rf /path/to/auth-mastery
```

### 2. Update Your Frontend Code

#### Update API Endpoints
If your frontend was calling `http://localhost:3000/api/...`, update to:
- Local dev: `http://localhost:5173/api/...`
- Production: adjust `FRONTEND_URL` in `.env`

#### Example: Update API Calls

**Before (separate backend):**
```typescript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

**After (integrated):**
```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

### 3. Environment Variables

Move all `.env` variables from `auth-mastery/.env` to `auth-canvas/.env`:

```bash
# From auth-mastery/.env
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
JWT_SECRET=...
PORT=3000

# To auth-canvas/.env
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
JWT_SECRET=...
PORT=5173          # Changed: Frontend port
FRONTEND_URL=http://localhost:5173
```

### 4. Database Migration

If using a database in `auth-mastery/server.js`:

1. Update `src/lib/user-db.ts` to connect to your database
2. Replace in-memory implementation with database queries
3. Test thoroughly before deploying

**Example: PostgreSQL Migration**
```typescript
// src/lib/user-db.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export class UserDatabase {
  async addUser(user: User): Promise<User> {
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [user.email, user.password]
    );
    return result.rows[0];
  }
  // ... other methods
}
```

### 5. Deployment

**Previous Setup:**
- Deploy auth-canvas to frontend host (Vercel, Netlify, etc.)
- Deploy auth-mastery to backend host (Heroku, Digital Ocean, etc.)
- Configure CORS between different origins

**New Setup:**
- Deploy auth-canvas to single host (same handles frontend + backend)
- No CORS issues between frontend and backend
- Simpler deployment pipeline

### 6. Testing

After migration, test all features:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Test endpoints
curl http://localhost:5173/api/auth/signup -d '{"email":"test@example.com","password":"pass123"}'

# Test frontend
Open http://localhost:5173 in browser
```

## Comparison: Separate vs Integrated

### Separate Projects (OLD)
| Aspect | Details |
|--------|---------|
| **Running locally** | Terminal 1: `npm run dev` (frontend), Terminal 2: `node server.js` (backend) |
| **Deployment** | 2 separate deployments, different hosts |
| **API calls** | Cross-origin requests (CORS needed) |
| **Development** | 2 separate projects to manage |
| **Build process** | Frontend and backend built separately |

### Integrated Project (NEW)
| Aspect | Details |
|--------|---------|
| **Running locally** | Single terminal: `npm run dev` (both frontend + backend) |
| **Deployment** | 1 unified deployment |
| **API calls** | Same-origin requests (no CORS needed) |
| **Development** | Single project to manage |
| **Build process** | Unified build pipeline |

## Troubleshooting Migration Issues

### Issue: API 404 errors
**Solution:** API routes must be in `src/routes/api/` directory. Check file structure.

### Issue: CORS errors
**Solution:** With integrated project, CORS should not be needed. Remove CORS headers from routes.

### Issue: Environment variables not loading
**Solution:** Ensure `.env` file exists in project root and is not in `.gitignore`.

### Issue: TypeScript errors in API routes
**Solution:** Make sure TypeScript is configured correctly for the routes. Check `tsconfig.json`.

## Rollback Plan

If you need to revert to separate projects:

1. Keep a git branch with the separate project setup
2. All the original code is still available in git history
3. The `auth-mastery/` folder can be preserved separately if needed

## Git Management

### Update Git (if applicable)
```bash
# If using git submodules for separate projects
git submodule deinit -f auth-mastery
rm -rf .git/modules/auth-mastery

# If not using submodules, simply delete and commit
rm -rf auth-mastery
git add -A
git commit -m "Integrate auth-mastery into auth-canvas"
```

## Performance Considerations

### Benefits of Integration
- ✅ No network latency between frontend and backend
- ✅ Simplified deployment and scaling
- ✅ Easier debugging and development
- ✅ Reduced operational complexity

### Database Considerations
- Current in-memory storage won't persist across restarts
- For production: implement persistent database
- See Database Migration section above

## Next Steps

1. ✅ Run `npm install` to ensure all dependencies are installed
2. ✅ Test the integrated project locally with `npm run dev`
3. ✅ Verify all API endpoints work
4. ✅ Update frontend code to use relative API paths
5. ✅ Delete `auth-mastery` folder when ready
6. ✅ Commit changes to git
7. ✅ Deploy integrated project

## Support

If you encounter issues:
1. Check INTEGRATION_GUIDE.md for detailed documentation
2. Review troubleshooting section above
3. Ensure `.env` file has all required variables
4. Check TypeScript compilation for errors
5. Review browser console for frontend errors
6. Check terminal output for backend errors

---

**Integration Date:** 2025-07-10  
**Status:** Complete
