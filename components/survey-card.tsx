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
import {DeleteSurvey, DeleteSurveyToggle} from './delete-survey';

export const SurveyCard = ({survey}: {survey: SurveySchema}) => {
  const questionCount = survey.elements.length;
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
        <DeleteSurvey surveyId={survey}>
          <DeleteSurveyToggle>Delete survey</DeleteSurveyToggle>
        </DeleteSurvey>
        <Button variant="default" asChild>
          <Link href={`/editor/${survey.id}/designer`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
