import {SurveyElementSchema} from '@/types/element';
import {useDesignerStoreFields} from '../store/designer-store/designer-store';

export const useElementIndex = (element: SurveyElementSchema | null) => {
  const {_entities} = useDesignerStoreFields();

  if (!element) {
    return 0;
  }

  const index = _entities.findIndex((el) => el === element.id);

  return index;
};
