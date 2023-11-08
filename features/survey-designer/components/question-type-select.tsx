import {QuestionType} from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {formatQuestionType} from '@/lib/utils';
import {useSurveyFieldActions} from '@/stores/survey-schema';
import {useActiveQuestion} from '../hooks/use-active-question';

const ALLOWED_TYPES = [QuestionType.SHORT_TEXT, QuestionType.LONG_TEXT];

const questionTypeOptions = Object.values(QuestionType)
  // TODO: Remove this when we have more question types
  // @ts-ignore
  .filter((val) => ALLOWED_TYPES.includes(val))
  .map((value) => ({
    value,
    label: formatQuestionType(value),
  }));

export const QuestionTypeSelect = () => {
  const {changeQuestionType} = useSurveyFieldActions();
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
        value={activeQuestion?.type ?? QuestionType.SHORT_TEXT}
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
