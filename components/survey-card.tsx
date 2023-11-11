import Link from 'next/link';
import {SurveySchema} from '@/lib/validations/survey';
import {Button} from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import {DeleteSurveyButton} from './delete-survey-button';

export const SurveyCard = ({survey}: {survey: SurveySchema}) => {
  const questionCount = survey.questions.length;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{survey.title}</CardTitle>
        <CardDescription>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
        </CardDescription>
      </CardHeader>
      <CardContent>{questionCount} questions</CardContent>
      <CardFooter className="justify-between">
        <DeleteSurveyButton surveyId={survey.id} />
        <Button variant="default" asChild>
          <Link href={`/survey/${survey.id}/editor`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
