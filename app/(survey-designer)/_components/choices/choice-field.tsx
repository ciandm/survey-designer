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
import {useSurveyStoreActions} from '@/survey-designer/_store/survey-designer-store';
import {ChoicesSchema} from '@/types/element';

type ChoiceFieldProps = {
  handleRemoveChoice: (id: string) => void;
  handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  choices: ChoicesSchema;
  choice: ChoicesSchema[number];
  index: number;
  focusInputs: React.MutableRefObject<HTMLInputElement[]>;
  elementId: string;
};

export const ChoicesField = ({
  choice,
  index,
  choices,
  elementId,
  focusInputs,
  handleInputKeyDown,
  handleRemoveChoice,
}: ChoiceFieldProps) => {
  const {updateQuestionChoice} = useSurveyStoreActions();

  return (
    <Sortable
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
  );
};
