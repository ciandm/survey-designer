import {useDesignerStoreActions} from '@/survey-designer/_store/designer-store';
import {FieldSchema, FieldType} from '@/types/field';

export const useFieldSettings = (field: FieldSchema) => {
  const storeActions = useDesignerStoreActions();

  const handleChangeFieldType = (type: FieldType) => {
    storeActions.fields.changeFieldType({
      id: field.id,
      type,
    });
  };

  const handleCheckedChange = (checked: boolean) => {
    storeActions.fields.updateField(field.id, {
      validations: {
        required: checked,
      },
    });
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    storeActions.fields.updateField(field.id, {
      text: e.target.value,
    });
  };

  const handleChangeDescription = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    storeActions.fields.updateField(field.id, {
      description: e.target.value,
    });
  };

  const handleChangePlaceholder = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    storeActions.fields.updateField(field.id, {
      properties: {
        placeholder: e.target.value,
      },
    });
  };

  return {
    handleChangeFieldType,
    handleCheckedChange,
    handleChangeTitle,
    handleChangeDescription,
    handleChangePlaceholder,
  };
};
