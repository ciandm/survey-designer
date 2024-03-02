import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {db} from '@/lib/db';
import {updateModelInput} from '@/lib/validations/survey';

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
  const parsed = updateModelInput.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(parsed.error, {status: 400});
  }

  const survey = await db.survey.update({
    where: {
      id: params.id,
    },
    data: {
      model: {
        ...parsed.data.model,
        version: parsed.data.model.version + 1,
      },
    },
  });

  return NextResponse.json({survey}, {status: 200});
}
