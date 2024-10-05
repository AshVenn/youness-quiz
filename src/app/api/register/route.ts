// app/api/register/route.ts

import bcrypt from 'bcryptjs';
import { User } from '@/lib/models/models';
import { dbConnect } from '@/lib/db/db';
import { registerSchema } from '@/lib/validation/validation';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Parse and validate the request body
    const { username, firstName, lastName, email, password } = registerSchema.parse(
      await req.json()
    );

    // Connect to the database
    await dbConnect();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email déjà utilisé' },
        { status: 400 }
      );
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the new user with remainingAttempts set to 2
    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      passwordHash,
      remainingAttempts: 2,
    });
    await newUser.save();

    // Return success response
    return NextResponse.json(
      { message: 'Utilisateur enregistré avec succès!' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      {
        message:
          "Erreur lors de l'inscription. Veuillez réessayer.",
      },
      { status: 400 }
    );
  }
}
