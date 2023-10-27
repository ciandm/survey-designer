import {NextRequest} from 'next/server';
import {z} from 'zod';
import prisma from '@/prisma/client';

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export async function POST(
  req: NextRequest,
  context: z.infer<typeof routeContextSchema>,
) {
  const {params} = routeContextSchema.parse(context);

  return new Response(null, {status: 204});
}
