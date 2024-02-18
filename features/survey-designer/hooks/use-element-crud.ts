import {v4 as uuidv4} from 'uuid';
import {ELEMENT_TYPE, ElementType} from '@/lib/constants/element';
import {getNextElementToSelect} from '@/lib/utils';
import {setActiveElementRef} from '../store/active-element-ref';
import {
  deleteElement,
  duplicateElement,
  insertElement,
  surveyElementsSelector,
  useSurveyDesignerStore,
} from '../store/survey-designer';
import {useActiveElement} from './use-active-element';

export const useElementCrud = () => {
  const {activeElement} = useActiveElement();
  const elements = useSurveyDesignerStore(surveyElementsSelector);

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
    type?: ElementType;
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
