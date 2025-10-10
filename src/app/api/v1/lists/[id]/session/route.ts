import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { getUserFromSession } from '@/utils/auth/auth';

// Create or update a learn session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: listId } = await params;
    const sessionCookie = request.cookies.get('polarlearn.session-id')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromSession(sessionCookie);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      mode,
      method,
      subject,
      lang_from,
      lang_to,
      flipQuestionLang,
      currentWordIndex,
      remainingWords,
      learnListQueue,
      originalWordCount,
      originalQueueLength,
      score,
      answerLog,
      incorrectAnswerLog,
      lastWord,
      lastAnswer,
      isPaused,
      isCompleted
    } = body;

    // Check if a session already exists for this user/list/mode that's not completed
    const existingSession = await prisma.learnSession.findFirst({
      where: {
        userId: user.id,
        listId: listId,
        mode: mode,
        isCompleted: false  // Only look for active sessions
      }
    });

    let session;

    if (existingSession) {
      // Update existing session
      session = await prisma.learnSession.update({
        where: { id: existingSession.id },
        data: {
          method,
          subject,
          lang_from,
          lang_to,
          flipQuestionLang,
          currentWordIndex,
          remainingWords,
          learnListQueue,
          originalWordCount,
          originalQueueLength,
          score,
          answerLog,
          incorrectAnswerLog,
          lastWord,
          lastAnswer,
          isPaused: isPaused ?? true,
          isCompleted: isCompleted ?? false,
          lastActiveAt: new Date()
        }
      });
    } else {
      // Create new session
      session = await prisma.learnSession.create({
        data: {
          userId: user.id,
          listId: listId,
          mode,
          method,
          subject,
          lang_from,
          lang_to,
          flipQuestionLang: flipQuestionLang ?? false,
          currentWordIndex,
          remainingWords,
          learnListQueue,
          originalWordCount: originalWordCount ?? 0,
          originalQueueLength: originalQueueLength ?? 0,
          score,
          answerLog,
          incorrectAnswerLog,
          lastWord,
          lastAnswer,
          isPaused: isCompleted ? false : true,  // Auto-set isPaused based on completion
          isCompleted: isCompleted ?? false,
          lastActiveAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        }
      });
    }

    return NextResponse.json({
      success: true,
      sessionId: session.sessionId,
      created: !existingSession
    });

  } catch (error) {
    console.error('Error saving learn session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

// Delete a learn session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: listId } = await params;
    const sessionCookie = request.cookies.get('polarlearn.session-id')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromSession(sessionCookie);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get mode from query parameter
    const url = new URL(request.url);
    const mode = url.searchParams.get('mode');

    if (!mode) {
      return NextResponse.json({ error: 'Mode parameter required' }, { status: 400 });
    }

    // Find and delete the session
    const deletedSession = await prisma.learnSession.deleteMany({
      where: {
        userId: user.id,
        listId: listId,
        mode: mode,
        isCompleted: false
      }
    });

    return NextResponse.json({
      success: true,
      deletedCount: deletedSession.count
    });

  } catch (error) {
    console.error('Error deleting learn session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}

// Update an existing session (partial update)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: listId } = await params;
    const sessionCookie = request.cookies.get('polarlearn.session-id')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromSession(sessionCookie);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { mode, ...updateData } = body;

    // Find the session to update
    const existingSession = await prisma.learnSession.findFirst({
      where: {
        userId: user.id,
        listId: listId,
        mode: mode,
        isCompleted: false
      }
    });

    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Update the session
    const session = await prisma.learnSession.update({
      where: { id: existingSession.id },
      data: {
        ...updateData,
        lastActiveAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      sessionId: session.sessionId
    });

  } catch (error) {
    console.error('Error updating learn session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}