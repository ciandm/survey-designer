import {ElementType, ScreenType} from '@/types/element';
import {SurveyScreenKey} from '@/types/survey';

export const getStoreKeyForScreenType = (type: ScreenType): SurveyScreenKey => {
  return type === 'welcome_screen' ? 'welcome' : 'thank_you';
};
