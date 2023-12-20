import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
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

  const survey = await prisma.survey.update({
    data: {
      is_published: false,
    },
    where: {
      id: params.id,
    },
  });

  return NextResponse.json({survey}, {status: 200});
}

export async function PUT(
  req: NextRequest,
  context: z.infer<typeof routeContextSchema>,
) {
  const {params} = routeContextSchema.parse(context);

  const survey = await prisma.survey.update({
    data: {
      is_published: true,
    },
    where: {
      id: params.id,
    },
  });

  return NextResponse.json({survey}, {status: 200});
}
