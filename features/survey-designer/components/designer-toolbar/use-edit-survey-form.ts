import {usePathname} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {updateModelAction} from '@/features/survey-designer/actions/update-model';
import {
  useDesignerStoreElements,
  useDesignerStoreSurvey,
} from '@/features/survey-designer/store/designer-store';
import {buildSurveyModel} from '@/features/survey-designer/utils/model';
import {
  SurveyFormState,
  useSurveyForm,
  UseSurveyFormProps,
} from '@/hooks/use-survey-form';

type useEditSurveyForm = {
  initialData?: UseSurveyFormProps['initialData'];
  id: string;
  onSuccess?: (data: SurveyFormState) => void;
};

export const useEditSurveyForm = ({
  initialData,
  id,
  onSuccess,
}: useEditSurveyForm) => {
  const pathname = usePathname();
  const form = useSurveyForm({initialData});
  const elements = useDesignerStoreElements();
  const survey = useDesignerStoreSurvey();
  const {execute: handleUpdateModel, status: editStatus} = useAction(
    updateModelAction,
    {
      onSuccess: (_, {model: {title = '', description = ''}}) => {
        onSuccess?.({title, description});
        form.reset({title, description});
      },
    },
  );

  const onSubmit = form.handleSubmit(
    (data) => {
      if (pathname === '/demo') {
        onSuccess?.(data);
        form.reset(data);
        return;
      }
      const model = buildSurveyModel({elements, survey});
      handleUpdateModel({
        id,
        model: {
          ...model,
          title: data.title,
          description: data.description,
        },
      });
    },
    (errors) => console.log(errors),
  );

  return {
    form,
    editStatus,
    onSubmit,
  };
};
