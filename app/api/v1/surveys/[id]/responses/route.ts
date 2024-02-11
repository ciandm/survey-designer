import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {addOrUpdateSurveyResponseSchema} from '@/lib/validations/survey';
import prisma from '@/prisma/client';

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export async function DELETE(
  req: NextRequest,
  context: z.infer<typeof routeContextSchema>,
) {
  const {params} = routeContextSchema.parse(context);

  await prisma.surveyResponses.deleteMany({
    where: {
      surveyId: params.id,
    },
  });

  return new Response(null, {status: 204});
}

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
    const {responseId} = parsed.data;
    if (responseId) {
      const response = await prisma.surveyResponses.update({
        where: {
          id: responseId,
        },
        data: {
          responses: parsed.data.answers,
        },
      });

      return NextResponse.json({response}, {status: 200});
    } else {
      const survey = await prisma.surveyResponses.create({
        data: {
          surveyId: params.id,
          responses: parsed.data.answers,
        },
      });
      return NextResponse.json({survey}, {status: 200});
    }
  } catch (error) {
    return NextResponse.json({error}, {status: 500});
  }
}
