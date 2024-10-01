import mongoose from 'mongoose';
import { NextResponse, NextRequest } from 'next/server';
import { Quiz, User, Subject } from '@/lib/models/models';
import { dbConnect } from '@/lib/db/db';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getToken } from 'next-auth/jwt';

const genAI = new GoogleGenerativeAI(`${process.env.GOOGLE_GEMINI_API_KEY}`);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const body = await request.json();
    const { prompt, difficulty, subject, timerEnabled, timerDuration } = body;

    if (!prompt || typeof prompt !== 'string' || !difficulty || !subject) {
      return NextResponse.json({ message: 'Le prompt, la difficulté ou le sujet sont manquants ou invalides.' }, { status: 400 });
    }

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.id) {
      return NextResponse.json({ message: 'Non autorisé. Veuillez vous connecter.' }, { status: 401 });
    }

    const userId = token.id;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    if (user.remainingAttempts <= 0) {
      return NextResponse.json({ message: 'Vous n\'avez plus de tentatives restantes.' }, { status: 400 });
    }

    // Check if the subject is an existing one or a new one
    let subjectId;
    if (mongoose.Types.ObjectId.isValid(subject)) {
      // If it's a valid ObjectId, treat it as an existing subject
      const existingSubject = await Subject.findById(subject);
      if (!existingSubject) {
        return NextResponse.json({ message: 'Le sujet sélectionné est invalide.' }, { status: 400 });
      }
      subjectId = existingSubject._id;
    } else {
      // Create a new subject if it's a new string
      const newSubject = new Subject({ name: subject, createdBy: user._id });
      await newSubject.save();
      subjectId = newSubject._id;
    }

    const formattedPrompt = `
      Veuillez générer 5 questions de quiz à choix multiples sur le sujet suivant : "${prompt}".
      Le niveau de difficulté est : ${difficulty}.
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

    const cleanGeneratedText = (text: string): string => {
      return text.replace(/(^```json|```$)/gm, '').trim();
    };

    let generatedQuestions: any[];
    try {
      const cleanedText = cleanGeneratedText(generatedText);
      generatedQuestions = JSON.parse(cleanedText);
    } catch (error) {
      console.error('Parsing Error:', error);
      return NextResponse.json({ message: 'Erreur lors du parsing des questions générées.' }, { status: 500 });
    }

    if (!Array.isArray(generatedQuestions) || generatedQuestions.length !== 5) {
      return NextResponse.json({ message: 'Erreur lors de la génération des questions.' }, { status: 500 });
    }

    const newQuiz = new Quiz({
      prompt,
      questions: generatedQuestions,
      createdBy: user._id,
      difficulty,
      subject: subjectId, // Store the subject reference
      timerEnabled,
      timerDuration: timerEnabled ? timerDuration : undefined,
    });

    await newQuiz.save();

    user.remainingAttempts -= 1;
    await user.save();

    return NextResponse.json({ quizId: newQuiz._id }, { status: 200 });
  } catch (error) {
    console.error('Error during request:', error);
    return NextResponse.json({ message: 'Erreur lors de la génération du quiz.' }, { status: 500 });
  }
}
