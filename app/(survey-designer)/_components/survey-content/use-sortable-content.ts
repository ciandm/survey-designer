import {
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {arrayMove, sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {useSurveyStoreActions} from '@/survey-designer/_store/survey-designer-store';

export const useSortableContent = () => {
  const storeActions = useSurveyStoreActions();
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
      storeActions.setFields((fields) => {
        const oldIndex = fields.findIndex((q) => q.id === active.id);
        const newIndex = fields.findIndex((q) => q.id === over?.id);

        return arrayMove(fields, oldIndex, newIndex);
      });
    }
  };

  return {
    sensors,
    handleDragEnd,
  };
};
