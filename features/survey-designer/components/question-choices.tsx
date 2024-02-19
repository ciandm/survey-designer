import {
  createContext,
  useContext,
  useEffect,
  useId,
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
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {ChoicesSchema} from '@/lib/validations/survey';
import {
  deleteQuestionChoice,
  insertQuestionChoice,
  moveQuestionChoices,
  updateQuestionChoice,
} from '../store/survey-designer';

type QuestionChoicesProps = {
  children:
    | ((props: {
        handleInsertChoice: () => void;
        handleRemoveChoice: (choiceId: string) => void;
        isAddChoiceDisabled: boolean;
      }) => React.ReactNode)
    | React.ReactNode;
  choices?: ChoicesSchema;
  elementId: string;
};

export const QuestionChoices = ({
  children,
  choices = [],
  elementId,
}: QuestionChoicesProps) => {
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

  const isAddChoiceDisabled = choices.some((choice) => choice.value === '');

  return (
    <QuestionChoicesContext.Provider
      value={{
        focusIndex,
        setFocusIndex,
        focusInputs,
        choices,
        elementId,
      }}
    >
      {typeof children === 'function'
        ? children({
            handleInsertChoice,
            handleRemoveChoice,
            isAddChoiceDisabled,
          })
        : children}
    </QuestionChoicesContext.Provider>
  );
};

type ChoicesListProps = {
  children: React.ReactNode;
};

const ChoicesList = ({children}: ChoicesListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const {choices, elementId} = useQuestionChoicesContext();

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;

    if (active.id !== over?.id) {
      const oldIndex = choices.findIndex((choice) => choice.id === active.id);
      const newIndex = choices.findIndex((choice) => choice.id === over?.id);

      const newChoices = arrayMove(choices, oldIndex, newIndex);
      moveQuestionChoices({elementId, newChoices});
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
        <div className="space-y-1.5">{children}</div>
      </SortableContext>
    </DndContext>
  );
};

QuestionChoices.List = ChoicesList;

type ChoiceFieldProps = {
  choice: ChoicesSchema[number];
  index: number;
};

const ChoiceField = ({choice, index}: ChoiceFieldProps) => {
  const id = useId();
  const {setFocusIndex, focusInputs, choices, elementId} =
    useQuestionChoicesContext();

  const handleRemoveChoice = (choiceId: string) => {
    deleteQuestionChoice({elementId, choiceId});
    setFocusIndex(choices.length - 2);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value !== '') {
      e.preventDefault();
      setFocusIndex(choices.length);
      insertQuestionChoice({elementId});
    }
  };

  return (
    <Sortable
      className="grid grid-cols-[40px_1fr_40px] gap-2"
      key={`${id}-${choice.id}`}
      id={choice.id}
      isDisabled={choices.length === 1}
      renderSortHandle={({attributes, listeners, isSorting}) => (
        <Button
          size="icon"
          variant="ghost"
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
      <>
        <Input
          type="text"
          value={choice.value}
          ref={(el) => (el ? (focusInputs.current[index] = el) : null)}
          onChange={(e) =>
            updateQuestionChoice({
              elementId,
              newChoice: {
                id: choice.id,
                value: e.target.value,
              },
            })
          }
          onKeyDown={onInputKeyDown}
        />
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
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
      </>
    </Sortable>
  );
};

QuestionChoices.Choice = ChoiceField;

type Context = {
  focusIndex: number | null;
  setFocusIndex: React.Dispatch<React.SetStateAction<number | null>>;
  focusInputs: React.MutableRefObject<HTMLInputElement[]>;
  choices: ChoicesSchema;
  elementId: string;
};

const QuestionChoicesContext = createContext<Context | null>(null);

const useQuestionChoicesContext = () => {
  const context = useContext(QuestionChoicesContext);

  if (!context) {
    throw new Error(
      'useQuestionChoicesContext must be used within a QuestionChoicesProvider',
    );
  }

  return context;
};
