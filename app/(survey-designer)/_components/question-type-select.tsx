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
import {ElementSchemaType} from '@/types/element';

const questionTypeOptions = Object.values(ELEMENT_TYPE).map((value) => ({
  value,
  label: formatQuestionType(value),
}));

type QuestionTypeSelectProps = {
  id?: string;
  className?: string;
  element: ElementSchemaType;
  onChange: (type: ElementType) => void;
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
