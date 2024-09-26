import bcrypt from 'bcryptjs';
import { User } from '@/lib/models/models';
import { dbConnect } from '@/lib/db/db';
import { registerSchema } from '@/lib/validation/validation';
import { NextRequest, NextResponse } from 'next/server';

// Named export for the POST method
export async function POST(req: NextRequest) {
  try {
    // Parse and validate the request body
    const { username, email, password } = registerSchema.parse(await req.json());

    // Connect to the database
    await dbConnect();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email déjà utilisé' }, { status: 400 });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the new user with attemptsAllowed set to 2
    const newUser = new User({ 
      username, 
      email, 
      passwordHash, 
      attemptsAllowed: 2 // Set default attempts to 2
    });
    await newUser.save();

    // Return success response
    return NextResponse.json({ message: 'Utilisateur enregistré avec succès!' }, { status: 201 });
  } catch (error: any) {
    // Handle errors
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
