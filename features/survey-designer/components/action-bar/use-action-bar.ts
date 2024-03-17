import {arrayMove} from '@dnd-kit/sortable';
import {
  useDesignerStoreActions,
  useDesignerStoreFields,
} from '@/features/survey-designer/store/designer-store';
import {FieldSchema} from '@/types/field';
import {UseDesignerElementReturn} from '../designer/hooks/use-designer-element';

type UseActionBarProps = {
  field: FieldSchema;
  onSetSelectedElement: UseDesignerElementReturn['handleSetSelectedElement'];
};

export const useActionBar = ({
  field,
  onSetSelectedElement,
}: UseActionBarProps) => {
  const fields = useDesignerStoreFields();
  const storeActions = useDesignerStoreActions();

  const handleClickMoveDown = () => {
    storeActions.fields.setFields(({_entities, ...rest}) => {
      const index = _entities.indexOf(field.id);
      const newOrder = arrayMove(_entities, index, index + 1);
      return {
        ...rest,
        _entities: newOrder,
      };
    });
  };

  const handleClickMoveUp = () => {
    storeActions.fields.setFields(({_entities, ...rest}) => {
      const index = _entities.indexOf(field.id);
      const newOrder = arrayMove(_entities, index, index - 1);
      return {
        ...rest,
        _entities: newOrder,
      };
    });
  };

  const handleRequiredChange = (required: boolean) => {
    storeActions.fields.updateField(field.id, () => ({
      validations: {
        required,
      },
    }));
  };

  const handleDuplicateField = (duplicateId: string) => {
    const {id = ''} =
      storeActions.fields.duplicateField({id: duplicateId}) ?? {};
    onSetSelectedElement({id});
  };

  const handleRemoveField = (id: string) => {
    const index = fields._entities.indexOf(id);
    const nextId = fields._entities[index + 1] ?? fields._entities[index - 1];
    storeActions.fields.deleteField({id});
    onSetSelectedElement({id: nextId});
  };

  return {
    handleClickMoveDown,
    handleClickMoveUp,
    handleRequiredChange,
    handleDuplicateField,
    handleRemoveField,
  };
};
