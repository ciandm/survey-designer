import {Metadata, ResolvingMetadata} from 'next';
import {notFound} from 'next/navigation';
import {
  SurveyShell,
  SurveyShellAside,
  SurveyShellMain,
} from '@/components/survey-shell';
import {db} from '@/lib/db';
import {modelSchema} from '@/lib/validations/survey';
import {SurveyForm} from '@/survey/_components/survey-form';
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

  return (
    <SurveyShell>
      <SurveyShellAside
        title={model.title}
        description={model.description}
        className="md:top-0 md:h-screen"
      />
      <SurveyShellMain>
        <SurveyForm model={model} surveyId={survey.id} />
      </SurveyShellMain>
    </SurveyShell>
  );
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
