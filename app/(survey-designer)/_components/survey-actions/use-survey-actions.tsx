import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {publishSurveyAction} from '@/survey-designer/_actions/publish-survey';
import {updateModelAction} from '@/survey-designer/_actions/update-model';
import {
  useDesignerStoreActions,
  useDesignerStoreElements,
  useDesignerStoreSurvey,
  useDesignerStoreSurveyId,
} from '@/survey-designer/_store/designer-store';
import {buildSurveyModel} from '@/survey-designer/_utils/model';

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
