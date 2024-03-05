import {ErrorMessage} from '@hookform/error-message';
import {useSurveyFormContext} from '@/hooks/use-survey';
import {cn} from '@/lib/utils';
import {ElementSchemaType} from '@/types/element';
import {FormDescription, FormField, FormItem, FormLabel} from './ui/form';
import {TypeInputField} from './type-field';

type QuestionFieldProps = {
  index: number;
  element: ElementSchemaType;
};

export const QuestionField = ({index, element}: QuestionFieldProps) => {
  const {control} = useSurveyFormContext();
  return (
    <FormField
      control={control}
      name="value"
      render={({field}) => (
        <FormItem>
          <div className="flex flex-col gap-1">
            <FormLabel
              className={cn('break-normal text-base font-medium leading-6', {
                [`after:content-['_*']`]: element.validations.required,
              })}
            >
              {index + 1}. {!!element.text ? element.text : 'Untitled question'}
            </FormLabel>
            {!!element.description && (
              <FormDescription>{element.description}</FormDescription>
            )}
          </div>
          <div className="mt-4">
            <TypeInputField field={field} element={element} />
          </div>
          <ErrorMessage
            name="value"
            render={({message}) => (
              <p className="text-sm font-medium leading-5 text-red-500">
                {message}
              </p>
            )}
          />
        </FormItem>
      )}
    />
  );
};
