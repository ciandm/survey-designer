import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {surveySchemaUpdate} from '@/lib/validations/survey';
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
  const parsed = surveySchemaUpdate.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(parsed.error, {status: 400});
  }

  const survey = await prisma.survey.update({
    where: {
      id: params.id,
    },
    data: {
      schema: parsed.data.survey,
    },
  });

  return NextResponse.json({survey}, {status: 200});
}
