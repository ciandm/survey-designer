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
import {ElementSchema} from '@/lib/validations/survey';
import {QuestionFormState} from './survey-form';

type FieldProps = {
  field: ControllerRenderProps<QuestionFormState, `fields.${number}.value`>;
};

export const ShortTextField = ({field}: FieldProps) => {
  return (
    <FormControl>
      <Input {...field} onChange={(e) => field.onChange([e.target.value])} />
    </FormControl>
  );
};

export const LongTextField = ({field}: FieldProps) => {
  return (
    <FormControl>
      <Textarea {...field} onChange={(e) => field.onChange([e.target.value])} />
    </FormControl>
  );
};

type MultipleChoiceFieldProps = {
  element: ElementSchema;
  field: ControllerRenderProps<QuestionFormState, `fields.${number}.value`>;
  index: number;
};

export const MultipleChoiceField = ({
  element,
  index,
}: MultipleChoiceFieldProps) => {
  const {control} = useFormContext<QuestionFormState>();
  const choices = element.properties.choices ?? [];
  const hasValidChoices =
    choices.length > 0 && choices.every((choice) => !!choice.value);

  if (!hasValidChoices) {
    return null;
  }

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
                {choice.value}
              </FormLabel>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};

export const SingleChoiceField = ({
  element,
  field,
}: Omit<MultipleChoiceFieldProps, 'index'>) => {
  const choices = element.properties.choices ?? [];
  const hasValidChoices =
    choices.length > 0 && choices.every((choice) => !!choice.value);

  if (!hasValidChoices) {
    return null;
  }

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
              <FormLabel className="font-normal">{choice.value}</FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      </FormControl>
    </FormItem>
  );
};