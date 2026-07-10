import jwt from 'jsonwebtoken';
import { userDatabase } from '@/lib/user-db';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization code' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri:
          process.env.GITHUB_CALLBACK_URL ||
          `${new URL(request.url).origin}/api/auth/github/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('GitHub token error:', tokenData);
      return new Response(
        JSON.stringify({ error: 'Failed to obtain access token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user profile
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/json',
      },
    });

    const profile = await userResponse.json();

    // Fetch user emails
    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/json',
      },
    });

    const emails = await emailsResponse.json();
    const primaryEmail =
      emails.find((e: any) => e.primary)?.email || emails[0]?.email || profile.login;

    // Find or create user
    let user = userDatabase.findUserByGithubId(String(profile.id));
    if (!user) {
      user = userDatabase.addUser({
        id: Date.now(),
        email: primaryEmail,
        githubId: String(profile.id),
        name: profile.name || profile.login,
      });
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email, githubId: user.githubId },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${frontendUrl}?token=${jwtToken}&user=${encodeURIComponent(
          JSON.stringify({ id: user.id, email: user.email, name: user.name })
        )}`,
      },
    });
  } catch (error) {
    console.error('GitHub callback error:', error);
    return new Response(
      JSON.stringify({ error: 'GitHub authentication failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
