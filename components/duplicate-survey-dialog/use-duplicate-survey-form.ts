import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {createSurveyAction} from '@/features/survey-designer/actions/create-survey';
import {useSurveyForm, UseSurveyFormProps} from '@/hooks/use-survey-form';
import {getSiteUrl} from '@/utils/hrefs';

type UseDuplicateSurveyFormProps = UseSurveyFormProps & {
  id: string;
};

export const useDuplicateSurveyForm = ({
  initialData,
  id,
}: UseDuplicateSurveyFormProps) => {
  const form = useSurveyForm({initialData});
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
      duplicatedFrom: id,
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
