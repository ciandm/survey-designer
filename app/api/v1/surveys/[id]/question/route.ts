import {NextRequest} from 'next/server';
import {z} from 'zod';
import prisma from '@/prisma/client';

export async function POST(req: NextRequest) {
  const {params} = routeContextSchema.parse(context);

  await prisma.survey.delete({
    where: {
      id: params.id,
    },
  });

  return new Response(null, {status: 204});
}
