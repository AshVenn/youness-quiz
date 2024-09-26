// src/app/api/quiz/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { Quiz, User } from '@/lib/models/models';
import { dbConnect } from '@/lib/db/db';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getToken } from 'next-auth/jwt';

const genAI = new GoogleGenerativeAI(`${process.env.GOOGLE_GEMINI_API_KEY}`);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const body = await request.json();
    const prompt: string = body.prompt;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ message: 'Le prompt est manquant ou invalide.' }, { status: 400 });
    }

    // Retrieve the user's token using NextRequest
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.id) {
      return NextResponse.json({ message: 'Non autorisé. Veuillez vous connecter.' }, { status: 401 });
    }

    const userId = token.id;

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Check if the user has remaining attempts
    if (user.remainingAttempts <= 0) {
      return NextResponse.json({ message: 'Vous n\'avez plus de tentatives restantes.' }, { status: 400 });
    }

    // Construct the formatted prompt with instructions
    const formattedPrompt = `
      Veuillez générer 5 questions de quiz à choix multiples sur le sujet suivant : "${prompt}".
      Chaque question doit être au format JSON suivant:
      {
        "text": "Question?",
        "options": ["A. Proposition 1", "B. Proposition 2", "C. Proposition 3", "D. Proposition 4"],
        "correctAnswer": 0
      }
      Le champ "correctAnswer" doit être l'index (à partir de 0) de la bonne réponse.
      Ne pas inclure de balises de code, de délimiteurs de code (comme \`\`\`json), ni de texte supplémentaire.
      Retournez uniquement les questions sous forme de tableau JSON valide.
    `;

    const result = await model.generateContent(formattedPrompt);
    const response = await result.response;

    const generatedText = await response.text();

    if (!generatedText) {
      return NextResponse.json({ message: 'Erreur lors de la génération des questions.' }, { status: 500 });
    }

    // Function to clean the generated text
    const cleanGeneratedText = (text: string): string => {
      return text.replace(/(^```json|```$)/gm, '').trim();
    };

    // Parse the generated text into quiz questions
    let generatedQuestions: any[];
    try {
      const cleanedText = cleanGeneratedText(generatedText);
      generatedQuestions = JSON.parse(cleanedText);
    } catch (error) {
      console.error('Parsing Error:', error);
      return NextResponse.json({ message: 'Erreur lors du parsing des questions générées.' }, { status: 500 });
    }

    // Validate that we have 5 questions
    if (!Array.isArray(generatedQuestions) || generatedQuestions.length !== 5) {
      return NextResponse.json({ message: 'Erreur lors de la génération des questions.' }, { status: 500 });
    }

    // Create a new quiz document in the database
    const newQuiz = new Quiz({
      prompt,
      questions: generatedQuestions,
      createdBy: user._id,
    });

    // Save the quiz in the database
    await newQuiz.save();

    // Reduce the user's remaining attempts by 1
    user.remainingAttempts -= 1;
    await user.save();

    // Return the quiz ID as a response
    return NextResponse.json({ quizId: newQuiz._id }, { status: 200 });
  } catch (error) {
    console.error('Error during request:', error);
    return NextResponse.json({ message: 'Erreur lors de la génération du quiz.' }, { status: 500 });
  }
}
