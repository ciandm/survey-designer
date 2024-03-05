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
import {SurveyFormState} from '@/hooks/use-survey';
import {ElementSchemaType} from '@/types/element';

type FieldProps = {
  field: ControllerRenderProps<SurveyFormState, `fields.${number}.value`>;
  element: ElementSchemaType;
};

export const TypeInputField = ({field, element}: FieldProps) => {
  switch (element.type) {
    case 'short_text':
    case 'long_text':
      return <TextField field={field} element={element} />;
    case 'multiple_choice':
      return <MultipleChoiceField field={field} element={element} index={0} />;
    case 'single_choice':
      return <SingleChoiceField field={field} element={element} />;
    default:
      return null;
  }
};

const TextField = ({field, element}: FieldProps) => {
  const Component = element.type === 'short_text' ? Input : Textarea;
  return (
    <FormControl>
      <Component
        {...field}
        placeholder={element.properties.placeholder ?? 'Your answer here...'}
        onChange={(e) => field.onChange([e.target.value])}
      />
    </FormControl>
  );
};

type MultipleChoiceFieldProps = {
  element: ElementSchemaType;
  field: ControllerRenderProps<SurveyFormState, `fields.${number}.value`>;
  index: number;
};

const MultipleChoiceField = ({element, index}: MultipleChoiceFieldProps) => {
  const {control} = useFormContext<SurveyFormState>();
  const choices = element.properties.choices ?? [];

  return (
    <div className="flex flex-col gap-2">
      {choices.map((choice) => (
        <FormField
          key={choice.id}
          control={control}
          name={`fields.${index}.value`}
          render={({field}) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  {...field}
                  checked={field.value.includes(choice.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      field.onChange([...field.value, choice.id]);
                    } else {
                      field.onChange(
                        field.value.filter((value) => value !== choice.id),
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
  element,
  field,
}: Omit<MultipleChoiceFieldProps, 'index'>) => {
  const choices = element.properties.choices ?? [];

  return (
    <FormItem className="flex flex-col gap-2">
      <FormControl>
        <RadioGroup
          onValueChange={(value) => field.onChange([value])}
          defaultValue={field.value[0]}
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
  );
};
