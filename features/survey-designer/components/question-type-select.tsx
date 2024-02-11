import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {QUESTION_TYPE, QuestionType} from '@/lib/constants/question';
import {formatQuestionType} from '@/lib/utils';
import {QuestionSchema} from '@/lib/validations/survey';

const ALLOWED_TYPES = [
  QUESTION_TYPE.short_text,
  QUESTION_TYPE.long_text,
  QUESTION_TYPE.multiple_choice,
];

const questionTypeOptions = Object.values(QUESTION_TYPE)
  // TODO: Remove this when we have more question types
  // @ts-ignore
  .filter((val) => ALLOWED_TYPES.includes(val))
  .map((value) => ({
    value,
    label: formatQuestionType(value),
  }));

type Props = {
  id?: string;
  className?: string;
  question: QuestionSchema;
  onChange: (type: QuestionType) => void;
};

export const QuestionTypeSelect = ({
  id,
  className,
  question,
  onChange,
}: Props) => {
  return (
    <Select
      value={question?.type ?? QUESTION_TYPE.short_text}
      onValueChange={(value) => onChange(value as QuestionType)}
    >
      <SelectTrigger id={id} className={className}>
        <SelectValue placeholder="Select a question type" />
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
