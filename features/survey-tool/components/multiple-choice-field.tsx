import {Controller} from 'react-hook-form';
import {CheckCircle2Icon} from 'lucide-react';
import {Checkbox} from '@/components/ui/checkbox';
import {cn} from '@/lib/utils';
import {useQuestionContext} from './question-provider';
import {QuestionFormConnect} from './survey';

/**
 * TODO: Clean up this component
 * TODO: Add other option support
 */

export const MultipleChoiceField = () => {
  const {question, view} = useQuestionContext();

  const {choices} = question.properties;

  if (view === 'live') {
    return (
      <div className="flex flex-col items-start">
        <div className="flex w-full max-w-xs flex-col gap-3">
          <span className="text-sm text-muted-foreground">
            Pick one or more
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
                            'flex h-16 flex-1 cursor-pointer items-center gap-2 rounded-md border bg-white px-5 py-4 text-sm transition-colors',
                            {
                              'font-medium ring-2 ring-ring ring-offset-2':
                                isSelected,
                              'border-input hover:bg-white/80': !isSelected,
                            },
                          )}
                        >
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
                          {!!choice.value ? choice.value : '...'}
                          {isSelected && (
                            <span className="ml-auto">
                              <CheckCircle2Icon className="h-5 w-5 text-primary" />
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
        <span className="text-sm text-muted-foreground">Pick one or more</span>
        {choices?.map((choice) => {
          return (
            <div key={choice.id} className="h-10 rounded-md border p-10">
              {choice.value}
            </div>
          );
        })}
      </div>
    </div>
  );
};
