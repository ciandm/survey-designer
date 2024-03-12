import {ErrorMessage} from '@hookform/error-message';
import {useSurveyFormContext} from '@/hooks/use-survey';
import {FieldSchema} from '@/types/field';
import {cn} from '@/utils/classnames';
import {FormDescription, FormField, FormItem, FormLabel} from './ui/form';
import {TypeInputField} from './type-field';

type QuestionFieldProps = {
  index: number;
  field: FieldSchema;
};

export const QuestionField = ({index, field}: QuestionFieldProps) => {
  const {control} = useSurveyFormContext();
  return (
    <FormField
      control={control}
      name="value"
      render={({field: formField}) => (
        <FormItem>
          <div className="flex flex-col gap-1">
            <FormLabel
              className={cn('break-normal text-base font-medium leading-6', {
                [`after:content-['_*']`]: field.validations.required,
              })}
            >
              {index + 1}. {!!field.text ? field.text : 'Untitled question'}
            </FormLabel>
            {!!field.description && (
              <FormDescription>{field.description}</FormDescription>
            )}
          </div>
          <div className="mt-4">
            <TypeInputField formField={formField} field={field} />
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
