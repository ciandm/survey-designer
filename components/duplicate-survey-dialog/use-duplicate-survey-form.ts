import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {z} from 'zod';
import {createSurveyAction} from '@/survey-designer/_actions/create-survey';
import {getSiteUrl} from '@/utils/hrefs';

const schema = z.object({
  id: z.string(),
  title: z.string().min(1, {message: 'Every survey deserves a title'}),
  description: z.string().optional(),
});

type DuplicateSurveyFormState = z.infer<typeof schema>;

export type UseDuplicateSurveyFormProps = {
  data?: Partial<DuplicateSurveyFormState>;
};

export const useDuplicateSurveyForm = ({data}: UseDuplicateSurveyFormProps) => {
  const form = useForm<DuplicateSurveyFormState>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });
  const router = useRouter();
  const {execute: handleDuplicateSurvey, status} = useAction(
    createSurveyAction,
    {
      onSuccess: ({survey}) => {
        toast.success('Survey duplicated', {
          position: 'bottom-center',
        });
        router.push(getSiteUrl.designerPage({surveyId: survey.id}));
      },
    },
  );

  const onSubmit = form.handleSubmit((data) => {
    handleDuplicateSurvey({
      duplicatedFrom: data.id,
      title: data.title,
      description: data.description,
    });
  });

  return {
    form,
    status,
    onSubmit,
  };
};
