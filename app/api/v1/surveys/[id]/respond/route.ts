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
  const parsed = addOrUpdateSurveyResponseSchema.safeParse(req.body);

  if (!parsed.success) {
    return NextResponse.json(parsed.error, {status: 400});
  }

  const survey = await prisma.surveyResponse.update({
    data: {
      answers: parsed.data.answers,
    },
    where: {
      id: params.id,
    },
  });

  return NextResponse.json({survey}, {status: 200});
}
