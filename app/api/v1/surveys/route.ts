import {NextRequest, NextResponse} from 'next/server';
import {v4 as uuidv4} from 'uuid';
import {getUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {createSurveyInput, modelSchema} from '@/lib/validations/survey';

export async function GET(req: NextRequest, res: NextResponse) {
  const surveys = await db.survey.findMany({});

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
    const survey = await db.survey.findUnique({
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

    const model = modelSchema.safeParse(survey.model);

    if (!model.success) {
      return NextResponse.json(model.error, {status: 400});
    }

    const request = parsedData.data;
    const data = model.data;

    let title = request.title;
    let description = request.description;

    if (!title) {
      title = data.title ? `${data.title} (Copy)` : 'Untitled Survey (Copy)';
    }

    if (!description) {
      description = data.description
        ? `${data.description} (Copy)`
        : 'Untitled Survey (Copy)';
    }

    const createdSurvey = await db.survey.create({
      data: {
        userId: user.id,
        model: {
          ...model.data,
          title,
          description,
          elements: model.data.elements.map((element) => ({
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

  const survey = await db.survey.create({
    data: {
      userId: user.id,
      model: {
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
