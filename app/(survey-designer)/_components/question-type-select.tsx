import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {ELEMENT_TYPE} from '@/lib/constants/element';
import {ElementSchema, ElementType, SurveyElementTypes} from '@/types/element';
import {formatQuestionType} from '@/utils/survey';

const questionTypeOptions = Object.values(ELEMENT_TYPE).map((value) => ({
  value,
  label: formatQuestionType(value),
}));

type QuestionTypeSelectProps = {
  id?: string;
  className?: string;
  element?: ElementSchema;
  type?: SurveyElementTypes;
  onChange: (type: ElementType) => void;
  onOpenChange?: (open: boolean) => void;
};

export const QuestionTypeSelect = ({
  id,
  className,
  element,
  type,
  onChange,
  onOpenChange,
}: QuestionTypeSelectProps) => {
  const initType = element?.type ?? type;

  return (
    <Select
      value={initType ?? ELEMENT_TYPE.short_text}
      onValueChange={(value) => onChange(value as ElementType)}
      onOpenChange={onOpenChange}
    >
      <SelectTrigger id={id} className={className}>
        <SelectValue placeholder="Select a element type">
          {initType}
        </SelectValue>
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
