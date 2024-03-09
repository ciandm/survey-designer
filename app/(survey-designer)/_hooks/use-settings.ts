import {ElementSchemaType} from '@/types/element';
import {useDesignerActions} from '../_store/survey-designer-store';

export const useSettings = () => {
  const {updateElement} = useDesignerActions();

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const handleMinimumSelectionBlur = (
    value: string,
    element: ElementSchemaType,
  ) => {
    const minSelections = parseInt(value);

    updateElement({
      id: element.id,
      validations: {
        min_selections: minSelections,
      },
    });
  };

  const handleMaximumSelectionBlur = (
    value: string,
    element: ElementSchemaType,
  ) => {
    const currentMinSelections = element.validations.min_selections ?? 0;
    const maxSelections = parseInt(value);

    updateElement({
      id: element.id,
      validations: {
        max_selections: maxSelections,
        min_selections:
          currentMinSelections > maxSelections
            ? maxSelections
            : currentMinSelections,
      },
    });
  };

  return {
    handleKeyDown,
    handleMinimumSelectionBlur,
    handleMaximumSelectionBlur,
  };
};
