import {Metadata, ResolvingMetadata} from 'next';
import {notFound} from 'next/navigation';
import {
  SurveyShell,
  SurveyShellAside,
  SurveyShellMain,
} from '@/components/survey-shell';
import {db} from '@/lib/db';
import {surveySchema} from '@/lib/validations/survey';
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

  const schema = sortChoices(survey.schema);

  return (
    <SurveyShell>
      <SurveyShellAside
        title={schema.title}
        description={schema.description}
        className="md:top-0 md:h-screen"
      />
      <SurveyShellMain>
        <SurveyForm schema={schema} surveyId={survey.id} />
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
