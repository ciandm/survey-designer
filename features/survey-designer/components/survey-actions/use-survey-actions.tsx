import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {publishSurveyAction} from '@/features/survey-designer/actions/publish-survey';
import {updateModelAction} from '@/features/survey-designer/actions/update-model';
import {
  useDesignerStoreActions,
  useDesignerStoreElements,
  useDesignerStoreSurvey,
  useDesignerStoreSurveyId,
} from '@/features/survey-designer/store/designer-store';
import {buildSurveyModel} from '@/features/survey-designer/utils/model';

export const useSurveyActions = () => {
  const elements = useDesignerStoreElements();
  const survey = useDesignerStoreSurvey();
  const id = useDesignerStoreSurveyId();
  const storeActions = useDesignerStoreActions();

  const {execute: handlePublishSurvey, status: publishSurveyStatus} = useAction(
    publishSurveyAction,
    {
      onSuccess: ({survey}, {action}) => {
        const actionString = action === 'publish' ? 'published' : 'unpublished';
        storeActions.survey.setPublished(survey.is_published);
        toast(`Survey ${actionString} ${action === 'publish' ? '🥳' : ''}`, {
          description: `Your survey has been ${actionString} successfully.`,
          ...(action === 'publish' && {
            action: {
              label: 'View',
              onClick: () => {
                window.open(`/survey/${id}`);
              },
            },
          }),
        });
      },
    },
  );

  const {execute: handleSaveSchema, status: saveSchemaStatus} = useAction(
    updateModelAction,
    {
      onSuccess: () => {
        toast('Survey saved 🎉', {
          description: 'Your survey has been saved successfully.',
        });
      },
    },
  );

  const handleClickSave = () => {
    const model = buildSurveyModel({elements, survey});
    handleSaveSchema({id, model});
  };

  return {
    saveSurvey: {
      status: saveSchemaStatus,
      handleClickSave,
    },
    publishSurvey: {
      status: publishSurveyStatus,
      handlePublishSurvey,
    },
  };
};
