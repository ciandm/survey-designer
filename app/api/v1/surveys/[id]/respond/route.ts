import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {addOrUpdateSurveyResponseSchema} from '@/lib/validations/survey';
import prisma from '@/prisma/client';

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export async function PUT(
  req: NextRequest,
  context: z.infer<typeof routeContextSchema>,
) {
  const {params} = routeContextSchema.parse(context);
  const body = await req.json();
  const parsed = addOrUpdateSurveyResponseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(parsed.error, {status: 400});
  }

  try {
    const survey = await prisma.surveyResponse.upsert({
      where: {
        surveyId: params.id,
      },
      create: {
        surveyId: params.id,
        answers: parsed.data.answers,
      },
      update: {
        answers: parsed.data.answers,
      },
    });

    return NextResponse.json({survey}, {status: 200});
  } catch (error) {
    return NextResponse.json({error}, {status: 500});
  }
}
