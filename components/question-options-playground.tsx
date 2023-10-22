'use client';

import {useForm} from 'react-hook-form';
import {Prisma, QuestionType} from '@prisma/client';
import z from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {useSelectedQuestion} from '@/stores/question/selected-question';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import {Separator} from './ui/separator';
import {Switch} from './ui/switch';
import {Textarea} from './ui/textarea';

const QuestionOptionsPlayground = ({
  questions,
}: {
  questions: Prisma.QuestionGetPayload<{include: {answers: true}}>[];
}) => {
  const selectedQuestion = useSelectedQuestion();
  const question = questions.find((q) => q.id === selectedQuestion);

  if (!question) {
    return null;
  }

  return (
    <aside className="w-[480px] border-l p-4">
      <QuestionForm question={question} key={selectedQuestion} />
    </aside>
  );
};

const formSchema = z.object({
  question: z.string().min(2, {
    message: 'Question must be at least 2 characters long.',
  }),
  type: z.nativeEnum(QuestionType),
  description: z.string().optional(),
  hasDescription: z.boolean().optional(),
});

const QuestionForm = ({
  question,
}: {
  question: Prisma.QuestionGetPayload<{include: {answers: true}}>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      question: question?.text,
      type: question?.type || QuestionType.TEXT,
      hasDescription: false,
      description: '',
    },
  });

  const hasDescription = form.watch('hasDescription');

  return (
    <Form {...form}>
      <form className="flex flex-col">
        <div className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="question"
            render={({field}) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Textarea rows={2} placeholder="Your question" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({field}) => (
              <FormItem>
                <FormLabel>Question type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue>{field.value}</SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(QuestionType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator className="my-6 block" />
        <FormField
          control={form.control}
          name="hasDescription"
          render={({field}) => (
            <FormItem className="flex flex-row items-center justify-between gap-2">
              <div className="space-y-0.5">
                <FormLabel>Add a description</FormLabel>
                <FormDescription>
                  Provide useful information to your users.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {hasDescription && (
          <FormField
            control={form.control}
            name="description"
            render={({field}) => (
              <FormItem className="my-2">
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder="Your description"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
};

export default QuestionOptionsPlayground;
