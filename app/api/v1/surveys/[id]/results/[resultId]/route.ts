import {NextRequest} from 'next/server';
import {z} from 'zod';
import {prisma} from '@/prisma/client';

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
    resultId: z.string(),
  }),
});

export async function DELETE(
  req: NextRequest,
  context: z.infer<typeof routeContextSchema>,
) {
  const {params} = routeContextSchema.parse(context);

  await prisma.surveyResult.delete({
    where: {
      id: params.resultId,
    },
  });

  return new Response(null, {status: 204});
}
