import {useDesignerStoreActions} from '@/features/survey-designer/store/designer-store';
import {FieldSchema} from '@/types/field';

export const useChoicesOptions = () => {
  const storeActions = useDesignerStoreActions();

  const handleMinimumSelectionBlur = (value: string, field: FieldSchema) => {
    const minSelections = parseInt(value);

    storeActions.fields.updateField(field.id, {
      validations: {
        min_selections: minSelections,
      },
    });
  };

  const handleMaximumSelectionBlur = (value: string, field: FieldSchema) => {
    const currentMaxSelections = field.validations.max_selections ?? 0;
    const currentMinSelections = field.validations.min_selections ?? 0;
    const maxSelections = parseInt(value);

    if (currentMaxSelections === maxSelections) return;

    let newMinSelections = currentMinSelections;

    if (maxSelections === 0) {
      newMinSelections = currentMinSelections;
    } else if (currentMinSelections > maxSelections) {
      newMinSelections = maxSelections;
    }

    storeActions.fields.updateField(field.id, {
      validations: {
        max_selections: maxSelections,
        min_selections: newMinSelections,
      },
    });
  };

  return {
    handleMinimumSelectionBlur,
    handleMaximumSelectionBlur,
  };
};
