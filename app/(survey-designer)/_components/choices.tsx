import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import {Button, ButtonProps} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {ChoicesSchema} from '@/lib/validations/survey';
import {useDesignerActions} from '@/survey-designer/_store/survey-designer-store';

type ChoicesProps = {
  children: React.ReactNode;
  choices?: ChoicesSchema;
  elementId: string;
};

export const Choices = ({children, choices = [], elementId}: ChoicesProps) => {
  const {handlers, focus, isAddChoiceDisabled} = useChoices({
    choices,
    elementId,
  });

  const value = useMemo(
    () => ({
      focus,
      handlers,
      isAddChoiceDisabled,
      choices,
      elementId,
    }),
    [focus, handlers, isAddChoiceDisabled, choices, elementId],
  );

  return (
    <ChoicesContext.Provider value={value}>{children}</ChoicesContext.Provider>
  );
};

export const ChoicesList = () => {
  const {moveChoices} = useDesignerActions();
  const id = useId();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const {choices, elementId} = useChoicesContext();

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;

    if (active.id !== over?.id) {
      const oldIndex = choices.findIndex((choice) => choice.id === active.id);
      const newIndex = choices.findIndex((choice) => choice.id === over?.id);

      const newChoices = arrayMove(choices, oldIndex, newIndex);
      moveChoices({elementId, newChoices});
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

type ChoiceFieldProps = {
  choice: ChoicesSchema[number];
  index: number;
};

const ChoicesField = ({choice, index}: ChoiceFieldProps) => {
  const {
    focus: {focusInputs},
    handlers: {handleRemoveChoice, handleInputKeyDown},
    choices,
    elementId,
  } = useChoicesContext();
  const {updateQuestionChoice} = useDesignerActions();

  return (
    <Sortable
      className="flex flex-1 gap-2"
      id={choice.id}
      isDisabled={choices.length === 1}
      renderSortHandle={({attributes, listeners, isSorting}) => (
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
      )}
    >
      <Input
        className="h-10 flex-1"
        defaultValue={choice.value}
        key={`${choice.id}-${index}-${choice.value}`}
        ref={(el) => (el ? (focusInputs.current[index] = el) : null)}
        onBlur={(e) =>
          updateQuestionChoice({
            elementId,
            newChoice: {
              id: choice.id,
              value: e.target.value,
            },
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
    </Sortable>
  );
};

export const ChoicesAddChoice = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'onClick'>
>(({children, ...rest}, ref) => {
  const {
    handlers: {handleInsertChoice},
    choices,
  } = useChoicesContext();

  return (
    <Button
      disabled={isAddChoiceDisabled(choices)}
      ref={ref}
      {...rest}
      onClick={handleInsertChoice}
    >
      {children}
    </Button>
  );
});

ChoicesAddChoice.displayName = 'ChoicesAddChoice';

export const ChoicesRemoveAll = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'onClick'>
>(({children, ...rest}, ref) => {
  const {
    handlers: {handleRemoveAll},
    choices,
  } = useChoicesContext();

  return (
    <Button
      disabled={isRemoveAllDisabled(choices)}
      ref={ref}
      {...rest}
      onClick={handleRemoveAll}
    >
      {children}
    </Button>
  );
});

ChoicesRemoveAll.displayName = 'ChoicesRemoveAll';

type Context = {
  focus: {
    focusIndex: number | null;
    setFocusIndex: React.Dispatch<React.SetStateAction<number | null>>;
    focusInputs: React.MutableRefObject<HTMLInputElement[]>;
  };
  handlers: {
    handleInsertChoice: () => void;
    handleRemoveChoice: (choiceId: string) => void;
    handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleRemoveAll: () => void;
  };
  choices: ChoicesSchema;
  elementId: string;
};

const ChoicesContext = createContext<Context | null>(null);

const useChoicesContext = () => {
  const context = useContext(ChoicesContext);

  if (!context) {
    throw new Error('useChoicesContext must be used within a ChoicesProvider');
  }

  return context;
};

function isAddChoiceDisabled(choices: ChoicesSchema = []): boolean {
  return choices.filter((choice) => choice.value === '').length > 1;
}

function isRemoveAllDisabled(choices: ChoicesSchema = []): boolean {
  return choices.length === 1;
}

type UseChoicesProps = {
  choices: ChoicesSchema;
  elementId: string;
};

const useChoices = ({elementId, choices = []}: UseChoicesProps) => {
  const {insertQuestionChoice, deleteQuestionChoice, deleteChoices} =
    useDesignerActions();
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const focusInputs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (focusIndex !== null) {
      focusInputs.current[focusIndex]?.focus();
      setFocusIndex(null);
    }
  }, [focusIndex]);

  const handleInsertChoice = () => {
    insertQuestionChoice({elementId});
    setFocusIndex(choices.length);
  };

  const handleRemoveChoice = (choiceId: string) => {
    deleteQuestionChoice({elementId, choiceId});
    setFocusIndex(choices.length - 2);
  };

  const handleRemoveAll = () => {
    deleteChoices({elementId});
    setFocusIndex(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value !== '') {
      e.preventDefault();
      setFocusIndex(choices.length);
      insertQuestionChoice({elementId});
    }
  };

  const isAddChoiceDisabled = choices.some((choice) => choice.value === '');

  return {
    handlers: {
      handleInsertChoice,
      handleRemoveChoice,
      handleInputKeyDown,
      handleRemoveAll,
    },
    focus: {
      focusIndex,
      setFocusIndex,
      focusInputs,
    },
    isAddChoiceDisabled,
  };
};
