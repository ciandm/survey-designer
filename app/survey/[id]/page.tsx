import {Metadata, ResolvingMetadata} from 'next';
import {notFound} from 'next/navigation';
import {Survey} from '@/features/survey-tool/components/survey';
import {ID_PREFIXES} from '@/lib/constants/question';
import {ChoicesSchema} from '@/lib/validations/survey';
import {SurveySchema, surveySchema} from '@/lib/validations/survey';
import prisma from '@/prisma/client';

type Props = {
  params: {
    id: string;
  };
};

const SurveyPage = async ({params}: Props) => {
  const survey = await prisma.survey.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!survey) {
    return null;
  }

  if (!survey.is_published) {
    return <h1>This survey does not exist</h1>;
  }

  const schema = surveySchema.safeParse(survey.schema);

  if (!schema.success) {
    return notFound();
  }

  const schemaWithRandomisedChoices = randomiseQuestionChoices(schema.data);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex justify-center border-b p-4">
        {schema.data.title}
      </header>
      <Survey schema={schemaWithRandomisedChoices} />
    </div>
  );
};

export default SurveyPage;

export const dynamic = 'force-dynamic';

function randomiseQuestionChoices(data: SurveySchema): SurveySchema {
  return {
    ...data,
    questions: data.questions.map((question) => {
      if (question.type === 'multiple_choice') {
        return {
          ...question,
          properties: {
            ...question.properties,
            choices: question.properties.randomise
              ? randomiseChoices(question.properties.choices)
              : question.properties.choices,
          },
        };
      }

      return question;
    }),
  };
}

function randomiseChoices(choices: ChoicesSchema = []) {
  const copiedChoices = [...choices];

  return copiedChoices.sort((choice) => {
    if (choice.id.startsWith(ID_PREFIXES.OTHER_CHOICE)) return 1;

    return Math.random() - 0.5;
  });
}

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
