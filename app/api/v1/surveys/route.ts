import {NextRequest, NextResponse} from 'next/server';
import {v4 as uuidv4} from 'uuid';
import {getUser} from '@/lib/auth';
import {createSurveyInput, surveySchema} from '@/lib/validations/survey';
import prisma from '@/prisma/client';

export async function GET(req: NextRequest, res: NextResponse) {
  const surveys = await prisma.survey.findMany({});

  return new Response(JSON.stringify(surveys));
}

export async function POST(req: NextRequest, res: NextResponse) {
  const {user} = await getUser();

  if (!user) {
    return NextResponse.json({message: 'Unauthorized'}, {status: 401});
  }

  const searchParams = req.nextUrl.searchParams;
  const surveyToDuplicate = searchParams.get('survey_to_duplicate');

  if (surveyToDuplicate) {
    const survey = await prisma.survey.findUnique({
      where: {id: surveyToDuplicate},
    });

    if (!survey) {
      return NextResponse.json({message: 'Survey not found'}, {status: 404});
    }

    const body = await req.json();
    const parsedData = createSurveyInput.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(parsedData.error, {status: 400});
    }

    const parsedSchema = surveySchema.safeParse(survey.schema);

    if (!parsedSchema.success) {
      return NextResponse.json(parsedSchema.error, {status: 400});
    }

    const request = parsedData.data;
    const schema = parsedSchema.data;

    let title = request.title;
    let description = request.description;

    if (!title) {
      title = schema.title
        ? `${schema.title} (Copy)`
        : 'Untitled Survey (Copy)';
    }

    if (!description) {
      description = schema.description
        ? `${schema.description} (Copy)`
        : 'Untitled Survey (Copy)';
    }

    const createdSurvey = await prisma.survey.create({
      data: {
        userId: user.id,
        schema: {
          ...parsedSchema.data,
          title,
          description,
          elements: parsedSchema.data.elements.map((element) => ({
            ...element,
            id: uuidv4(),
            ref: uuidv4(),
            properties: {
              ...element.properties,
              choices:
                element.properties.choices?.map((choice) => ({
                  ...choice,
                  id: uuidv4(),
                })) ?? [],
            },
          })),
        },
      },
    });

    return NextResponse.json({survey: createdSurvey}, {status: 200});
  }

  const body = await req.json();
  const parsedData = createSurveyInput.safeParse(body);

  if (!parsedData.success) {
    return NextResponse.json(parsedData.error, {status: 400});
  }

  const survey = await prisma.survey.create({
    data: {
      userId: user.id,
      schema: {
        title: parsedData.data.title,
        description: parsedData.data.description,
        elements: [],
        version: 1,
        screens: {
          welcome: {
            message: null,
          },
          thank_you: {
            message: null,
          },
        },
      },
    },
  });

  return NextResponse.json({survey}, {status: 200});
}
