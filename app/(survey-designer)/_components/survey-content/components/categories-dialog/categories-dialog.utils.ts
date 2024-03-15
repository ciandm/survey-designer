import {isEmpty} from 'lodash';
import {useDesignerStoreScreens} from '@/survey-designer/_store/designer-store';
import {ElementGroup} from '@/types/element';
import {FieldType} from '@/types/field';
import {ScreenType} from '@/types/screen';

export const getIsCategoryButtonDisabled = (
  group: ElementGroup,
  type: FieldType | ScreenType,
  screens: ReturnType<typeof useDesignerStoreScreens>,
) => {
  if (group === 'Screens') {
    if (type === 'welcome_screen') {
      return !isEmpty(screens.welcome.data);
    }
    if (type === 'thank_you_screen') {
      return !isEmpty(screens.thank_you.data);
    }
  }
  return false;
};
