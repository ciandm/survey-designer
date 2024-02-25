import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {SurveySchema} from '@/lib/validations/survey';

type SurveyCardProps = {
  schema: SurveySchema;
  children: React.ReactNode;
};

export const SurveyCard = ({schema, children}: SurveyCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{schema.title}</CardTitle>
        <CardDescription>{schema.description}</CardDescription>
      </CardHeader>
      <CardContent>{schema.elements.length} questions</CardContent>
      <CardFooter className="justify-between">{children}</CardFooter>
    </Card>
  );
};
