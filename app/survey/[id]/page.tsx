import {Metadata, ResolvingMetadata} from 'next';
import {notFound} from 'next/navigation';
import {SurveyForm} from '@/features/survey-tool/components/survey-form';
import {sortQuestionChoices} from '@/features/survey-tool/utils/question';
import {SurveySchema, surveySchema} from '@/lib/validations/survey';
import prisma from '@/prisma/client';

type Props = {
  params: {
    id: string;
  };
};

async function getSurvey(id: string): Promise<SurveySchema | null> {
  try {
    const survey = await prisma.survey.findUnique({
      where: {
        id,
      },
    });

    if (!survey) {
      return null;
    }

    const parsedSurvey = surveySchema.safeParse(survey.schema);

    if (!parsedSurvey.success) {
      console.error('Invalid survey schema', parsedSurvey.error);
      return null;
    }

    return parsedSurvey.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

const SurveyPage = async ({params}: Props) => {
  const survey = await getSurvey(params.id);

  if (!survey) {
    return notFound();
  }

  const schemaWithRandomisedChoices = sortQuestionChoices(survey);

  return (
    <div className="bg-muted md:py-12">
      <SurveyForm schema={schemaWithRandomisedChoices} />
    </div>
  );
};

export default SurveyPage;

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  {params}: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const id = params.id;

  const survey = await prisma.survey.findUnique({
    where: {
      id,
    },
  });

  if (!survey) {
    return {
      title: 'Survey not found',
    };
  }

  const schema = surveySchema.safeParse(survey.schema);

  if (!schema.success) {
    return {
      title: 'Invalid survey schema',
    };
  }

  return {
    title: schema.data.title,
  };
}
