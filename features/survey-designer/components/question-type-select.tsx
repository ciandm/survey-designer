import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {ELEMENT_TYPE, ElementType} from '@/lib/constants/element';
import {formatQuestionType} from '@/lib/utils';
import {ElementSchema} from '@/lib/validations/survey';

const ALLOWED_TYPES = [
  ELEMENT_TYPE.short_text,
  ELEMENT_TYPE.long_text,
  ELEMENT_TYPE.multiple_choice,
  ELEMENT_TYPE.single_choice,
];

const questionTypeOptions = Object.values(ELEMENT_TYPE)
  // TODO: Remove this when we have more element types
  // @ts-ignore
  .filter((val) => ALLOWED_TYPES.includes(val))
  .map((value) => ({
    value,
    label: formatQuestionType(value),
  }));

type Props = {
  id?: string;
  className?: string;
  element: ElementSchema;
  onChange: (type: ElementType) => void;
  onOpenChange?: (open: boolean) => void;
};

export const QuestionTypeSelect = ({
  id,
  className,
  element,
  onChange,
  onOpenChange,
}: Props) => {
  return (
    <Select
      value={element?.type ?? ELEMENT_TYPE.short_text}
      onValueChange={(value) => onChange(value as ElementType)}
      onOpenChange={onOpenChange}
    >
      <SelectTrigger id={id} className={className}>
        <SelectValue placeholder="Select a element type" />
      </SelectTrigger>
      <SelectContent id={id}>
        <SelectGroup>
          {questionTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
