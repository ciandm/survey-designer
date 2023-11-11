import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {QUESTION_TYPE, QuestionType} from '@/lib/constants/question';
import {formatQuestionType} from '@/lib/utils/question';
import {useActiveQuestion} from '../hooks/use-active-question';
import {useQuestionActions} from '../store/questions';

const ALLOWED_TYPES = [QUESTION_TYPE.short_text, QUESTION_TYPE.long_text];

const questionTypeOptions = Object.values(QUESTION_TYPE)
  // TODO: Remove this when we have more question types
  // @ts-ignore
  .filter((val) => ALLOWED_TYPES.includes(val))
  .map((value) => ({
    value,
    label: formatQuestionType(value),
  }));

export const QuestionTypeSelect = () => {
  const {changeQuestionType} = useQuestionActions();
  const {activeQuestion} = useActiveQuestion();

  const onChangeFieldType = (newType: QuestionType) => {
    changeQuestionType({
      id: activeQuestion?.id ?? '',
      type: newType,
    });
  };

  return (
    <div className="border-b p-4">
      <p className="mb-4 text-sm font-medium leading-none">Type</p>
      <Select
        value={activeQuestion?.type ?? QUESTION_TYPE.short_text}
        onValueChange={(value) => onChangeFieldType(value as QuestionType)}
      >
        <SelectTrigger id="question-type" className="mt-2">
          <SelectValue placeholder="Select a question type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Simple</SelectLabel>
            {questionTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
