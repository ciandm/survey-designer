import {NextRequest, NextResponse} from 'next/server';
import {v4 as uuidv4} from 'uuid';
import {createSurveyInput, surveySchema} from '@/lib/validations/survey';
import prisma from '@/prisma/client';

export async function GET(req: NextRequest, res: NextResponse) {
  const surveys = await prisma.survey.findMany({});

  return new Response(JSON.stringify(surveys));
}

export async function POST(req: NextRequest, res: NextResponse) {
  const searchParams = req.nextUrl.searchParams;
  const surveyToDuplicate = searchParams.get('survey_to_duplicate');

  if (surveyToDuplicate) {
    const survey = await prisma.survey.findUnique({
      where: {id: surveyToDuplicate},
    });

    if (!survey) {
      return NextResponse.json({message: 'Survey not found'}, {status: 404});
    }

    const parsedSchema = surveySchema.safeParse(survey.schema);

    if (!parsedSchema.success) {
      return NextResponse.json(parsedSchema.error, {status: 400});
    }

    const {
      data: {elements, title},
    } = parsedSchema;

    const createdSurvey = await prisma.survey.create({
      data: {
        schema: {
          ...parsedSchema.data,
          title: title ? `${title} (Copy)` : 'Untitled Survey (Copy)',
          elements: elements.map((element) => ({
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

    const schema = JSON.parse(JSON.stringify(createdSurvey.schema));

    const updatedSurvey = await prisma.survey.update({
      where: {
        id: createdSurvey.id,
      },
      data: {
        schema: {
          ...schema,
          id: createdSurvey.id,
        },
      },
    });

    return NextResponse.json({survey: updatedSurvey}, {status: 200});
  }

  const body = await req.json();
  const parsedData = createSurveyInput.safeParse(body);

  if (!parsedData.success) {
    return NextResponse.json(parsedData.error, {status: 400});
  }

  const survey = await prisma.survey.create({
    data: {
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
