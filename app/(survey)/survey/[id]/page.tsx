import {Metadata, ResolvingMetadata} from 'next';
import {notFound} from 'next/navigation';
import {db} from '@/lib/db';
import {modelSchema} from '@/lib/validations/survey';
import {LiveSurvey} from '@/survey/_components/live-survey';
import {getSurvey} from '@/survey/_lib/get-survey';
import {sortChoices} from '@/survey/_utils/question';

type Props = {
  params: {
    id: string;
  };
};

const SurveyPage = async ({params}: Props) => {
  const survey = await getSurvey(params.id);

  if (!survey) {
    return notFound();
  }

  const model = sortChoices(survey.model);

  return <LiveSurvey model={model} />;
};

export default SurveyPage;

export async function generateMetadata(
  {params}: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
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
