import {v4 as uuidv4} from 'uuid';
import {ELEMENT_TYPE} from '@/lib/constants/element';
import {setActiveElementRef} from '@/survey-designer/_store/active-element-ref';
import {
  useDesignerActions,
  useSurveyElements,
} from '@/survey-designer/_store/survey-designer-store';
import {SurveyElementType} from '@/types/element';
import {getNextElementToSelect} from '@/utils/survey';
import {useActiveElement} from './use-active-element';

export const useElementCrud = () => {
  const {activeElement} = useActiveElement();
  const elements = useSurveyElements();
  const {insertElement, deleteElement, duplicateElement} = useDesignerActions();

  const handleRemoveElement = (id: string) => {
    const questionsBeforeDelete = elements;
    deleteElement({id});
    if (activeElement?.id === id) {
      if (questionsBeforeDelete.length === 1) {
        setActiveElementRef(null);
      } else {
        setActiveElementRef(getNextElementToSelect(elements, id));
      }
    }
  };

  const handleDuplicateElement = (id: string) => {
    const ref = uuidv4();
    duplicateElement({id, ref});
    setActiveElementRef(ref);
  };

  const handleCreateElement = ({
    type = ELEMENT_TYPE.short_text,
    index,
  }: {
    type?: SurveyElementType;
    index?: number;
  } = {}) => {
    const ref = uuidv4();
    insertElement(
      {
        id: uuidv4(),
        type,
        text: '',
        properties: {},
        ref,
        validations: {},
        description: '',
      },
      index,
    );
    setActiveElementRef(ref);
  };

  return {
    handleRemoveElement,
    handleDuplicateElement,
    handleCreateElement,
  };
};
