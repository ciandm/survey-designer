import {ScreenType, SurveyScreenKey} from '@/types/screen';

export const getStoreKeyForScreenType = (type: ScreenType): SurveyScreenKey => {
  return type === 'welcome_screen' ? 'welcome' : 'thank_you';
};
