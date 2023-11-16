import {Controller} from 'react-hook-form';
import {CheckCircle2Icon, Copy, Trash2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {
  deleteQuestionChoice,
  duplicateQuestionChoice,
  insertQuestionChoice,
  updateQuestionChoice,
} from '@/features/survey-designer/store/survey-designer';
import {cn} from '@/lib/utils';
import {useQuestionContext} from './question-provider';
import {QuestionFormConnect} from './survey';

/**
 * TODO: Clean up this component
 * TODO: Add other option support
 */

export const MultipleChoiceField = () => {
  const {question, view} = useQuestionContext();
  const {onAddChoiceClick, onChoiceChange, onChoiceDelete, onDuplicateChoice} =
    useChoiceField();

  const {choices} = question.properties;

  if (view === 'live') {
    return (
      <div className="flex flex-col items-start">
        <div className="flex w-full max-w-xs flex-col gap-3">
          <span className="text-sm text-muted-foreground">
            {question.properties.allow_multiple_selection
              ? 'Pick one or more'
              : 'Pick one'}
          </span>
          <QuestionFormConnect>
            {({control, formState}) => (
              <>
                {choices?.map((choice) => (
                  <Controller
                    key={choice.id}
                    control={control}
                    name="response"
                    render={({field}) => {
                      const isSelected = field.value?.includes(choice.id);

                      return (
                        <label
                          className={cn(
                            'flex h-10 flex-1 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
                            {
                              'font-medium ring-2 ring-ring ring-offset-2':
                                isSelected,
                              'border-input hover:bg-muted': !isSelected,
                            },
                          )}
                        >
                          {question.properties.allow_multiple_selection ? (
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, choice.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (id) => id !== choice.id,
                                      ),
                                    );
                              }}
                              className="sr-only"
                              name={field.name}
                            />
                          ) : (
                            // TODO: Fix styling
                            <input
                              className="sr-only"
                              type="radio"
                              checked={isSelected}
                              onChange={() => {
                                field.onChange([choice.id]);
                              }}
                              name={field.name}
                            />
                          )}
                          {choice.value}
                          {isSelected && (
                            <span className="ml-auto">
                              <CheckCircle2Icon className="h-4 w-4 text-primary" />
                            </span>
                          )}
                        </label>
                      );
                    }}
                  />
                ))}
                {formState.errors.response && (
                  <p className="mt-4 text-sm text-red-500">
                    {formState.errors.response.message}
                  </p>
                )}
              </>
            )}
          </QuestionFormConnect>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start">
      <div className="flex w-full max-w-sm flex-col gap-2">
        <span className="text-sm text-muted-foreground">
          {question.properties.allow_multiple_selection
            ? 'Pick one or more'
            : 'Pick one'}
        </span>
        {question.properties.choices?.map((choice) => {
          return (
            <div key={choice.id} className="flex flex-1">
              <Input
                type="text"
                value={choice.value}
                onChange={(event) =>
                  onChoiceChange(choice.id, event.target.value)
                }
              />
              <div className="ml-1 flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onChoiceDelete(choice.id)}
                  disabled={question.properties.choices?.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDuplicateChoice(choice.id)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <Button variant="secondary" className="mt-4" onClick={onAddChoiceClick}>
        Add choice
      </Button>
    </div>
  );
};

const useChoiceField = () => {
  const {question, view} = useQuestionContext();
  const onAddChoiceClick = () => {
    insertQuestionChoice({
      questionId: question.id,
    });
  };

  const onChoiceChange = (choiceId: string, value: string) => {
    updateQuestionChoice({
      questionId: question.id,
      newChoice: {
        id: choiceId,
        value,
      },
    });
  };

  const onChoiceDelete = (choiceId: string) => {
    deleteQuestionChoice({
      questionId: question.id,
      choiceId,
    });
  };

  const onDuplicateChoice = (choiceId: string) => {
    duplicateQuestionChoice({
      questionId: question.id,
      choiceId,
    });
  };

  return {
    onAddChoiceClick,
    onChoiceChange,
    onChoiceDelete,
    onDuplicateChoice,
  };
};
