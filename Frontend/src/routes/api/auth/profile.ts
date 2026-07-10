import jwt from 'jsonwebtoken';
import { userDatabase } from '@/lib/user-db';

export async function GET(request: Request) {
  try {
    // Get JWT token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix

    // Verify and decode JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

    // Find user in database
    const user = userDatabase.findUserById(decoded.userId);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          githubId: user.githubId,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Profile error:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
