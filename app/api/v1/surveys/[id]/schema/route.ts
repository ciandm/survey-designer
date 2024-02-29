import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {prisma} from '@/lib/client';
import {updateSchemaInput} from '@/lib/validations/survey';

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
  const parsed = updateSchemaInput.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(parsed.error, {status: 400});
  }

  const survey = await prisma.survey.update({
    where: {
      id: params.id,
    },
    data: {
      schema: {
        ...parsed.data.schema,
        version: parsed.data.schema.version + 1,
      },
    },
  });

  return NextResponse.json({survey}, {status: 200});
}
