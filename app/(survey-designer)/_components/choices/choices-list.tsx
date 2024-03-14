import {useId} from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {restrictToParentElement} from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {useDesignerStoreActions} from '@/survey-designer/_store/designer-store/designer-store';
import {ChoicesField} from './choice-field';
import {useChoicesContext} from './choices.context';

export const ChoicesList = () => {
  const {handlers, focus, choices, fieldId} = useChoicesContext();
  const storeActions = useDesignerStoreActions();
  const id = useId();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;

    if (active.id !== over?.id) {
      const oldIndex = choices.findIndex((choice) => choice.id === active.id);
      const newIndex = choices.findIndex((choice) => choice.id === over?.id);

      const newChoices = arrayMove(choices, oldIndex, newIndex);
      storeActions.choices.moveChoices(fieldId, {newChoices});
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
    >
      <SortableContext
        items={choices.map((choice) => choice.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-1 flex-col space-y-1.5">
          {choices.map((choice, index) => (
            <ChoicesField
              choices={choices}
              fieldId={fieldId}
              focusInputs={focus.focusInputs}
              handleInputKeyDown={handlers.handleInputKeyDown}
              handleRemoveChoice={handlers.handleRemoveChoice}
              index={index}
              choice={choice}
              key={`${id}-${choice.id}`}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
