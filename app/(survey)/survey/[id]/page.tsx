import {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {db} from '@/lib/db';
import {modelSchema} from '@/lib/validations/survey';
import {LiveSurvey} from '@/survey/_components/live-survey';
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

  return <LiveSurvey survey={survey} />;
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
    title: model.data.title,
  };
}
