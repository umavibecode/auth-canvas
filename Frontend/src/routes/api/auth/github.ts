export async function GET(request: Request) {
  try {
    // Get the callback URL from environment or construct it
    const callbackUrl = process.env.GITHUB_CALLBACK_URL ||
      `${new URL(request.url).origin}/api/auth/github/callback`;

    // Redirect to GitHub OAuth
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID || '',
      redirect_uri: callbackUrl,
      scope: 'user:email',
      state: Math.random().toString(36).substring(7), // Simple state token
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: `https://github.com/login/oauth/authorize?${params.toString()}`,
      },
    });
  } catch (error) {
    console.error('GitHub auth error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to initiate GitHub authentication' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
