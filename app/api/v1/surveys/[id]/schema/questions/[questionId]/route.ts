import {NextRequest, NextResponse} from 'next/server';
import {v4 as uuidv4} from 'uuid';
import {z} from 'zod';
import {surveySchema} from '@/lib/validations/survey';
import prisma from '@/prisma/client';

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
    questionId: z.string(),
  }),
});

export async function POST(
  req: NextRequest,
  context: z.infer<typeof routeContextSchema>,
) {
  const {params} = routeContextSchema.parse(context);

  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('question_to_duplicate');

  if (!query) {
    return NextResponse.json(
      {message: 'Question to duplicate not found'},
      {status: 404},
    );
  }

  const survey = await prisma.survey.findUnique({
    where: {id: params.id},
  });

  if (!survey) {
    return NextResponse.json({message: 'Survey not found'}, {status: 404});
  }

  let schema = surveySchema.safeParse(survey.schema);

  if (!schema.success) {
    return NextResponse.json(schema.error, {status: 400});
  }

  const questionToDuplicate = schema.data.questions.find(
    (field) => field.id === query,
  );

  if (!questionToDuplicate) {
    return NextResponse.json(
      {message: 'Question to clone not found'},
      {status: 404},
    );
  }

  const questionToDuplicateIndex = schema.data.questions.findIndex(
    (field) => field.id === query,
  );

  const newQuestion = {
    ...questionToDuplicate,
    text: questionToDuplicate.text.length
      ? `${questionToDuplicate.text} (copy)`
      : '',
    id: uuidv4(),
    ref: uuidv4(),
  };

  schema.data.questions.splice(questionToDuplicateIndex + 1, 0, newQuestion);

  const updatedSurvey = await prisma.survey.update({
    where: {id: params.id},
    data: {schema: schema.data},
  });

  return NextResponse.json({survey: updatedSurvey}, {status: 200});
}

export async function DELETE(
  req: NextRequest,
  context: z.infer<typeof routeContextSchema>,
) {
  const parsedParams = routeContextSchema.safeParse(context);

  if (!parsedParams.success) {
    return NextResponse.json(parsedParams.error, {status: 400});
  }

  const {params} = parsedParams.data;

  const survey = await prisma.survey.findUnique({
    where: {id: params.id},
  });

  if (!survey) {
    return NextResponse.json({message: 'Survey not found'}, {status: 404});
  }

  let schema = surveySchema.safeParse(survey.schema);

  if (!schema.success) {
    return NextResponse.json(schema.error, {status: 400});
  }

  schema.data.questions = schema.data.questions.filter(
    (question) => question.id !== params.questionId,
  );

  const updatedSurvey = await prisma.survey.update({
    where: {id: params.id},
    data: {schema: schema.data},
  });

  return NextResponse.json({survey: updatedSurvey}, {status: 200});
}