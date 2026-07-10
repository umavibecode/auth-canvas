import bcrypt from 'bcryptjs';
import { userDatabase } from '@/lib/user-db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user exists
    const existingUser = userDatabase.findUserByEmail(email);
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = userDatabase.addUser({
      id: Date.now(),
      email,
      password: hashedPassword,
    });

    return new Response(
      JSON.stringify({
        message: 'Welcome! Signup successful.',
        userId: newUser.id,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
