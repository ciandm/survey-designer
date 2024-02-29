import {Metadata, ResolvingMetadata} from 'next';
import {notFound} from 'next/navigation';
import {Card} from '@/components/ui/card';
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
    <div className="bg-muted sm:py-8">
      <div className="container max-w-2xl">
        <header className="mb-2 flex flex-col space-y-1 bg-card p-3 sm:bg-transparent sm:p-5">
          <h1 className="text-lg font-semibold">{schema.title}</h1>
          <p className="text-sm text-muted-foreground">{schema.description}</p>
        </header>
        <Card>
          <SurveyForm surveyId={params.id} schema={schema} />
        </Card>
      </div>
    </div>
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
