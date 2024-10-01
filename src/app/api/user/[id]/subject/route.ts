import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/db';
import { Subject, Quiz } from '@/lib/models/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

interface Params {
  id: string;
}

export async function POST(
  request: Request,
  { params }: { params: Params }
) {
  await dbConnect();

  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.id !== id) {
    return NextResponse.json(
      { message: 'Non autorisé.' },
      { status: 401 }
    );
  }

  try {
    const { name } = await request.json();

    // Check if a subject with the same name already exists for this user
    const existingSubject = await Subject.findOne({ name, createdBy: id });
    if (existingSubject) {
      return NextResponse.json(
        { message: 'Un sujet avec ce nom existe déjà.' },
        { status: 400 }
      );
    }

    // Create a new subject
    const newSubject = new Subject({ name, createdBy: id });
    await newSubject.save();

    return NextResponse.json({ subject: newSubject }, { status: 201 });
  } catch (error) {
    console.error('Error creating subject:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création du sujet.' },
      { status: 500 }
    );
  }
}


export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  await dbConnect();

  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.id !== id) {
    return NextResponse.json(
      { message: 'Non autorisé.' },
      { status: 401 }
    );
  }

  try {
    const subjects = await Subject.find({ createdBy: id }).sort({ name: 1 });

    // Get the count of quizzes for each subject
    const subjectsWithQuizCount = await Promise.all(subjects.map(async (subject) => {
      const quizCount = await Quiz.countDocuments({ subject: subject._id, createdBy: id });
      return {
        id: subject._id,
        name: subject.name,
        quizCount
      };
    }));
    

    return NextResponse.json({ subjects: subjectsWithQuizCount }, { status: 200 });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des sujets.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Params }
) {
  await dbConnect();

  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.id !== id) {
    return NextResponse.json(
      { message: 'Non autorisé.' },
      { status: 401 }
    );
  }

  try {
    const { oldSubject, newSubject } = await request.json();

    // Check if the new subject name already exists
    const existingSubject = await Subject.findOne({ name: newSubject, createdBy: id });
    if (existingSubject) {
      return NextResponse.json(
        { message: 'Un sujet avec ce nom existe déjà.' },
        { status: 400 }
      );
    }

    // Update the subject
    const updatedSubject = await Subject.findOneAndUpdate(
      { name: oldSubject, createdBy: id },
      { name: newSubject },
      { new: true }
    );

    if (!updatedSubject) {
      return NextResponse.json(
        { message: 'Sujet non trouvé.' },
        { status: 404 }
      );
    }

    // Update all quizzes with the old subject name
    await Quiz.updateMany(
      { subject: oldSubject, createdBy: id },
      { subject: newSubject }
    );

    return NextResponse.json({ subject: updatedSubject }, { status: 200 });
  } catch (error) {
    console.error('Error updating subject:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du sujet.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Params }
) {
  await dbConnect();

  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.id !== id) {
    return NextResponse.json(
      { message: 'Non autorisé.' },
      { status: 401 }
    );
  }

  try {
    const { subject } = await request.json();

    // Check if there are any quizzes with this subject
    const quizzesCount = await Quiz.countDocuments({ subject, createdBy: id });
    if (quizzesCount > 0) {
      return NextResponse.json(
        { message: 'Impossible de supprimer un sujet qui contient des quiz.' },
        { status: 400 }
      );
    }

    // Delete the subject
    const deletedSubject = await Subject.findOneAndDelete({ name: subject, createdBy: id });

    if (!deletedSubject) {
      return NextResponse.json(
        { message: 'Sujet non trouvé.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Sujet supprimé avec succès.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting subject:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du sujet.' },
      { status: 500 }
    );
  }
}