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

export const useSurveyModel = (): ParsedModelType => {
  const fields = useDesignerStoreFields();
  const screens = useDesignerStoreScreens();
  const survey = useDesignerStoreSurvey();

  return useMemo(
    () => ({
      fields: sortChoices(fieldsObjectToList(fields)),
      screens: {
        thank_you: screensObjectToList(screens.thank_you.data),
        welcome: screensObjectToList(screens.welcome.data),
      },
      title: survey.title ?? '',
      description: survey.description,
      version: 1,
    }),
    [fields, screens, survey],
  );
};
