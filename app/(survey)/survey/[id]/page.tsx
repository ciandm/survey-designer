import {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {Survey} from '@/components/survey';
import {db} from '@/lib/db';
import {modelSchema} from '@/lib/validations/survey';
import {getPublishedSurvey} from '@/survey/_lib/get-published-survey';

type Props = {
  params: {
    id: string;
  };
};

const SurveyPage = async ({params}: Props) => {
  const survey = await getPublishedSurvey(params.id);

  if (!survey) {
    return notFound();
  }

  return <Survey id={params.id} model={survey.model} />;
};

export default SurveyPage;

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const id = params.id;

  const survey = await db.survey.findUnique({
    where: {
      id,
    },
  });

  if (!survey) {
    return {
      title: 'Survey not found',
    };
  }

  const model = modelSchema.safeParse(survey.model);

  if (!model.success) {
    return {
      title: 'Invalid survey model',
    };
  }

  return {
    title: `Survey | ${model.data.title}`,
  };
}
