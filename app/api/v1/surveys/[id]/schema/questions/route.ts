import {NextRequest, NextResponse} from 'next/server';
import {v4 as uuidv4} from 'uuid';
import {z} from 'zod';
import {
  configurationSchema,
  createQuestionSchema,
} from '@/lib/validations/question';
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

  const body = await req.json();
  const parsed = createQuestionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(parsed.error, {status: 400});
  }

  const survey = await prisma.survey.findUnique({
    where: {id: params.id},
  });

  if (!survey) {
    return NextResponse.json({message: 'Survey not found'}, {status: 404});
  }

  let schema = configurationSchema.safeParse(survey.schema);

  if (!schema.success) {
    return NextResponse.json(schema.error, {status: 400});
  }

  schema.data.fields.push({
    id: uuidv4(),
    ref: uuidv4(),
    type: parsed.data.type,
    text: '',
    properties: {},
    validations: {},
  });

  const updatedSurvey = await prisma.survey.update({
    where: {id: params.id},
    data: {schema: schema.data},
  });

  return NextResponse.json({...updatedSurvey}, {status: 200});
}
