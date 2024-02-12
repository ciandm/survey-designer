import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {createResponseInput} from '@/lib/validations/survey';
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

export async function POST(
  req: NextRequest,
  context: z.infer<typeof routeContextSchema>,
) {
  const {params} = routeContextSchema.parse(context);
  const body = await req.json();
  const parsed = createResponseInput.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(parsed.error, {status: 400});
  }

  try {
    await prisma.surveyResponses.create({
      data: {
        surveyId: params.id,
        responses: parsed.data.responses,
      },
    });
    return NextResponse.json(null, {status: 200});
  } catch {
    return NextResponse.json(
      {error: 'An error occurred while creating the survey response'},
      {status: 500},
    );
  }
}
