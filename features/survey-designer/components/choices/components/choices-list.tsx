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
import {DragHandleDots2Icon} from '@radix-ui/react-icons';
import {Trash2} from 'lucide-react';
import {Sortable} from '@/components/sortable';
import {Button} from '@/components/ui';
import {Input} from '@/components/ui';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';
import {useDesignerStoreActions} from '@/features/survey-designer/store/designer-store';
import {useChoicesContext} from '../choices.context';

export const ChoicesList = () => {
  const {
    handlers: {handleInputKeyDown, handleRemoveChoice},
    focus: {focusInputs},
    choices,
    fieldId,
  } = useChoicesContext();
  const storeActions = useDesignerStoreActions();
  const id = useId();
  const dndId = useId();
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
      id={useId()}
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
            <Sortable
              key={`${id}-${choice.id}`}
              className="flex flex-1 gap-2"
              id={choice.id}
              isDisabled={choices.length === 1}
            >
              {({attributes, isSorting, listeners}) => (
                <>
                  <Input
                    className="h-10 flex-1"
                    defaultValue={choice.value}
                    key={`${choice.id}-${index}-${choice.value}`}
                    ref={(el) =>
                      el ? (focusInputs.current[index] = el) : null
                    }
                    onBlur={(e) =>
                      storeActions.choices.updateChoice(fieldId, choice.id, {
                        value: e.target.value,
                      })
                    }
                    onKeyDown={handleInputKeyDown}
                    placeholder="Type a choice"
                  />
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleRemoveChoice(choice.id)}
                          disabled={choices?.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs">
                        <p className="text-xs leading-snug">Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    size="icon"
                    variant="outline"
                    disabled={choices.length === 1}
                    style={{
                      cursor: isSorting ? 'grabbing' : 'grab',
                    }}
                    {...listeners}
                    {...attributes}
                  >
                    <DragHandleDots2Icon className="h-4 w-4" />
                  </Button>
                </>
              )}
            </Sortable>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
