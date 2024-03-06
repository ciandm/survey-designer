import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {ELEMENT_TYPE} from '@/lib/constants/element';
import {ElementSchemaType, SurveyElementType} from '@/types/element';
import {formatQuestionType} from '@/utils/survey';

const questionTypeOptions = Object.values(ELEMENT_TYPE).map((value) => ({
  value,
  label: formatQuestionType(value),
}));

type QuestionTypeSelectProps = {
  id?: string;
  className?: string;
  element: ElementSchemaType;
  onChange: (type: SurveyElementType) => void;
  onOpenChange?: (open: boolean) => void;
};

export const QuestionTypeSelect = ({
  id,
  className,
  element,
  onChange,
  onOpenChange,
}: QuestionTypeSelectProps) => {
  return (
    <Select
      value={element?.type ?? ELEMENT_TYPE.short_text}
      onValueChange={(value) => onChange(value as SurveyElementType)}
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
