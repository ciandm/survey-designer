'use client';

import {SurveyResult} from '@prisma/client';
import {CheckCircle2, Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
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
import {useDeleteSurveyResult} from '@/features/survey-designer/hooks/use-delete-response';
import {responsesSchema} from '@/lib/validations/survey';
import {ChoicesSchema} from '@/types/field';
import {SurveyWithParsedModelType} from '@/types/survey';

type ResponseProps = {
  surveyResult: SurveyResult;
  survey: SurveyWithParsedModelType;
};

export const Response = ({surveyResult, survey}: ResponseProps) => {
  const {model, id} = survey;
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
                surveyId: id,
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
          {model.fields.map((element, index) => {
            const response = data.find(
              (response) => response.questionId === element.id,
            );
            if (!response) return null;
            return (
              <TableRow key={element.id}>
                <TableCell
                  className=" w-[240px] max-w-[240px] overflow-hidden text-ellipsis align-top text-sm font-semibold"
                  title={element.text}
                >
                  <span className="truncate">
                    {index + 1}.{' '}
                    {!!element.text ? element.text : 'Untitled question'}
                  </span>
                  <Badge variant="outline" className="mt-2">
                    {element.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {(element.type === 'short_text' ||
                    element.type === 'long_text' ||
                    element.type === 'single_choice') && (
                    <>{response.value[0]}</>
                  )}
                  {element.type === 'multiple_choice' && (
                    <div className="flex flex-col gap-1">
                      {response.value.map((value, index) => {
                        const rv = getResponseValueByResponseId(
                          value,
                          element.properties.choices,
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
