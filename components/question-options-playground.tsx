'use client';

import {useState} from 'react';
import {Prisma} from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  updateQuestion,
  useQuestions,
  useSelectedQuestionId,
} from '@/stores/question/questions';
import {Label} from './ui/label';
import {Separator} from './ui/separator';
import {Switch} from './ui/switch';
import {Textarea} from './ui/textarea';

const QuestionOptionsPlayground = () => {
  const questions = useQuestions();
  const selectedQuestionId = useSelectedQuestionId();
  const question = questions[selectedQuestionId ?? ''];

  return <aside className="w-[480px] border-l p-4" id="options-playground" />;
};

const QuestionForm = ({
  question,
}: {
  question: Prisma.QuestionGetPayload<{include: {answers: true}}>;
}) => {
  const [hasDescription, setHasDescription] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="question">Question</Label>
          <Textarea
            id="question"
            rows={2}
            placeholder="Your question"
            value={question.text}
            onChange={(e) =>
              updateQuestion({id: question.id, text: e.target.value})
            }
          />
          {!question.text && (
            <p className="text-sm text-muted-foreground">
              Add a question to your survey
            </p>
          )}
        </div>
        <div>
          <Label>Question type</Label>
          <Select value="apple">
            <SelectTrigger>
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator className="my-6 block" />
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">Add a description</p>
          <p className="text-xs text-muted-foreground">
            Provide useful information to help your respondents answer the
            question
          </p>
        </div>
        <Switch
          onCheckedChange={(checked) => setHasDescription(checked)}
          checked={hasDescription}
        />
      </div>
      {hasDescription && (
        <Textarea
          rows={2}
          placeholder="Your description"
          className="mt-4"
          value={question.description ?? ''}
          onChange={(event) =>
            updateQuestion({
              id: question.id,
              description: event.target.value,
            })
          }
        />
      )}
    </div>
  );
};

export default QuestionOptionsPlayground;
