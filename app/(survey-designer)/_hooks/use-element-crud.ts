import {ELEMENT_TYPE} from '@/lib/constants/element';
import {
  useDesignerActions,
  useSurveyElements,
} from '@/survey-designer/_store/survey-designer-store';
import {SurveyElementType} from '@/types/element';
import {getNextElementToSelect} from '@/utils/survey';
import {useActiveElementActions} from '../_store/active-element-id-store';
import {useActiveElement} from './use-active-element';

export const useElementCrud = () => {
  const {activeElement} = useActiveElement();
  const elements = useSurveyElements();
  const {insertElement, deleteElement, duplicateElement} = useDesignerActions();
  const {setActiveElementId} = useActiveElementActions();

  const handleRemoveElement = (id: string) => {
    const elementsBeforeDelete = [...elements];
    deleteElement({id});
    if (activeElement?.id === id) {
      setActiveElementId(getNextElementToSelect(elementsBeforeDelete, id));
    }
  };

  const handleDuplicateElement = (id: string) => {
    const duplicatedElementId = duplicateElement({id});
    setActiveElementId(duplicatedElementId);
  };

  const handleCreateElement = ({
    type = ELEMENT_TYPE.short_text,
    index,
  }: {
    type?: SurveyElementType;
    index?: number;
  } = {}) => {
    const insertedElementId = insertElement(
      {
        type,
      },
      index,
    );
    setActiveElementId(insertedElementId);
  };

  return {
    handleRemoveElement,
    handleDuplicateElement,
    handleCreateElement,
  };
};
