import {ControllerRenderProps, useFormContext} from 'react-hook-form';
import {Checkbox} from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Textarea} from '@/components/ui/textarea';
import {FieldSchema} from '@/types/field';
import {SurveyFormState} from '@/types/survey';

type FieldProps = {
  formField: ControllerRenderProps<SurveyFormState, 'value'>;
  field: FieldSchema;
};

export const TypeInputField = ({field, formField}: FieldProps) => {
  switch (field.type) {
    case 'short_text':
    case 'long_text':
      return <TextField field={field} formField={formField} />;
    case 'multiple_choice':
      return (
        <MultipleChoiceField formField={formField} field={field} index={0} />
      );
    case 'single_choice':
      return <SingleChoiceField formField={formField} field={field} />;
    default:
      return null;
  }
};

const TextField = ({formField, field}: FieldProps) => {
  const Component = field.type === 'short_text' ? Input : Textarea;
  return (
    <FormControl>
      <Component
        {...formField}
        placeholder={field.properties.placeholder ?? 'Your answer here...'}
        onChange={(e) => formField.onChange([e.target.value])}
      />
    </FormControl>
  );
};

type MultipleChoiceFieldProps = {
  field: FieldSchema;
  formField: ControllerRenderProps<SurveyFormState, 'value'>;
  index: number;
};

const MultipleChoiceField = ({field}: MultipleChoiceFieldProps) => {
  const {control} = useFormContext<SurveyFormState>();
  const choices = field.properties.choices ?? [];

  return (
    <div className="flex flex-col gap-2">
      {choices.map((choice) => (
        <FormField
          key={choice.id}
          control={control}
          name="value"
          render={({field: formField}) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  {...formField}
                  checked={formField.value.includes(choice.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      formField.onChange([...formField.value, choice.id]);
                    } else {
                      formField.onChange(
                        formField.value.filter((value) => value !== choice.id),
                      );
                    }
                  }}
                />
              </FormControl>
              <FormLabel className="flex items-center gap-x-3 text-sm font-medium">
                {choice.value || '...'}
              </FormLabel>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};

const SingleChoiceField = ({
  formField,
  field,
}: Omit<MultipleChoiceFieldProps, 'index'>) => {
  const {control} = useFormContext<SurveyFormState>();
  const choices = field.properties.choices ?? [];

  return (
    <FormField
      control={control}
      name="value"
      render={({field: formField}) => (
        <FormItem className="flex flex-col gap-2">
          <FormControl>
            <RadioGroup
              onValueChange={(value) => formField.onChange([value])}
              defaultValue={formField.value[0]}
            >
              {choices.map((choice) => (
                <FormItem
                  className="flex items-center space-x-3 space-y-0"
                  key={choice.id}
                >
                  <FormControl>
                    <RadioGroupItem value={choice.value} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {choice.value || '...'}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
