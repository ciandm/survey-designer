import {
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {arrayMove, sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {useDesignerStoreActions} from '@/survey-designer/_store/designer-store';

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
      storeActions.fields.setFields(({_entities, ...restField}) => {
        const oldIndex = _entities.findIndex((o) => o === active.id);
        const newIndex = _entities.findIndex((o) => o === over?.id);

        const newOrder = arrayMove(_entities, oldIndex, newIndex);

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
