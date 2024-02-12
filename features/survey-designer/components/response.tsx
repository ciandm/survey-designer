'use client';

import {SurveyResult} from '@prisma/client';
import {CheckCircle2, Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useSurveyProvider} from '@/components/survey-provider';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {useToast} from '@/components/ui/use-toast';
import {ChoicesSchema, responsesSchema} from '@/lib/validations/survey';
import {useDeleteSurveyResult} from '../hooks/use-delete-response';

export const Response = ({surveyResult}: {surveyResult: SurveyResult}) => {
  const {survey} = useSurveyProvider();
  const {mutate, isPending} = useDeleteSurveyResult();
  const router = useRouter();
  const {toast} = useToast();

  const parsedResponses = responsesSchema.safeParse(surveyResult.responses);

  if (!parsedResponses.success) return null;

  const {data} = parsedResponses;

  return (
    <div className="flex w-full flex-1 flex-col rounded-md border bg-card">
      <div className="flex items-center justify-between border-b p-4">
        <p className="text-sm">
          Completed: {surveyResult.createdAt.toUTCString()}
        </p>
        <Button
          size="sm"
          variant="secondary"
          disabled={isPending}
          onClick={() =>
            mutate(
              {
                surveyId: survey.id,
                responseId: surveyResult.id,
              },
              {
                onSuccess: () => {
                  toast({
                    title: 'Response deleted',
                  });
                  router.refresh();
                },
              },
            )
          }
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Delete
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[240px]">Question</TableHead>
            <TableHead>Response</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {survey.questions.map((question, index) => {
            const response = data.find(
              (response) => response.questionId === question.id,
            );
            if (!response) return null;
            return (
              <TableRow key={question.id}>
                <TableCell
                  className=" w-[240px] max-w-[240px] overflow-hidden text-ellipsis align-top text-sm font-semibold"
                  title={question.text}
                >
                  <span className="truncate">
                    {index + 1}.{' '}
                    {!!question.text ? question.text : 'Untitled question'}
                  </span>
                  <Badge variant="outline" className="mt-2">
                    {question.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {(question.type === 'short_text' ||
                    question.type === 'long_text') && <>{response.value[0]}</>}
                  {question.type === 'multiple_choice' && (
                    <div className="flex flex-col gap-1">
                      {response.value.map((value, index) => {
                        const rv = getResponseValueByResponseId(
                          value,
                          question.properties.choices,
                        );
                        return (
                          <div key={index} className="flex items-center">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            <p>{rv}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <></>
    </div>
  );
};

function getResponseValueByResponseId(
  responseId: string,
  choices: ChoicesSchema = [],
) {
  const response = choices.find((choice) => choice.id === responseId);
  if (!response) return null;
  return response.value;
}
