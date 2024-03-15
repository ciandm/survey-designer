import {useMemo} from 'react';
import {ParsedModelType} from '@/types/survey';
import {sortChoices} from '@/utils/element';
import {
  useDesignerStoreFields,
  useDesignerStoreScreens,
  useDesignerStoreSurvey,
} from '../_store/designer-store/designer-store';
import {
  fieldsObjectToList,
  screensObjectToList,
} from '../_store/designer-store/designer-store.utils';

type UseSurveyModelProps = {
  shouldSortChoices?: boolean;
};

export const useSurveyModel = ({
  shouldSortChoices = false,
}: UseSurveyModelProps = {}): ParsedModelType => {
  const fields = useDesignerStoreFields();
  const screens = useDesignerStoreScreens();
  const survey = useDesignerStoreSurvey();

  const fieldsList = fieldsObjectToList(fields);

  return useMemo(
    () => ({
      fields: shouldSortChoices ? sortChoices(fieldsList) : fieldsList,
      screens: {
        thank_you: screensObjectToList(screens.thank_you.data),
        welcome: screensObjectToList(screens.welcome.data),
      },
      title: survey.title ?? '',
      description: survey.description,
      version: survey.version,
    }),
    [fieldsList, screens, survey, shouldSortChoices],
  );
};
