import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export type FullSurvey = Prisma.SurveyGetPayload<{
  include: {
    questions: {
      include: {
        answers: true;
      };
    };
  };
}>;

export async function GET(req: NextRequest, res: NextResponse) {
  const surveys = await prisma.survey.findMany({
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });

  return Response.json({ surveys });
}
