import {
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {arrayMove, sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {useDesignerStoreActions} from '@/survey-designer/_store/designer-store/designer-store';
import {
  fieldsListToFieldsObject,
  fieldsObjectToList,
} from '@/survey-designer/_store/designer-store/designer-store.utils';

export const useSortableContent = () => {
  const storeActions = useDesignerStoreActions();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    if (active.id !== over?.id) {
      storeActions.fields.setFields(({_entities: _order, ...restField}) => {
        const oldIndex = _order.findIndex((o) => o === active.id);
        const newIndex = _order.findIndex((o) => o === over?.id);

        const newOrder = arrayMove(_order, oldIndex, newIndex);

        return {
          ...restField,
          _entities: newOrder,
        };
      });
    }
  };

  return {
    sensors,
    handleDragEnd,
  };
};
