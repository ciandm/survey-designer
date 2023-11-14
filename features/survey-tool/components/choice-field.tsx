import {Copy, Trash2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
  deleteQuestionChoice,
  duplicateQuestionChoice,
  insertQuestionChoice,
  updateQuestionChoice,
} from '@/features/survey-designer/store/survey-designer';
import {useQuestionContext} from './question-provider';

export const ChoiceField = () => {
  const {question, view} = useQuestionContext();
  const {onAddChoiceClick, onChoiceChange, onChoiceDelete, onDuplicateChoice} =
    useChoiceField();

  if (view === 'live') {
    return (
      <div className="flex flex-col items-start">
        <div className="flex w-full flex-col gap-2">
          {question.properties.choices?.map((choice) => (
            <div key={choice.id} className="flex flex-1">
              <Input type="text" value={choice.value} disabled />
            </div>
          ))}
        </div>
        {question.properties.allow_other_option && (
          <div className="mt-2 flex items-center">
            <Input type="text" placeholder="Other..." disabled />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start">
      <div className="flex w-full flex-col gap-2">
        {question.properties.choices?.map((choice) => (
          <div key={choice.id} className="flex flex-1">
            <Input
              type="text"
              value={choice.value}
              onChange={(e) => onChoiceChange(choice.id, e.target.value)}
            />
            <div className="ml-1 flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onChoiceDelete(choice.id)}
                disabled={question.properties.choices?.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDuplicateChoice(choice.id)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {question.properties.allow_other_option && (
        <div className="mt-2 flex items-center">
          <Input type="text" placeholder="Other..." />
        </div>
      )}
      <Button variant="secondary" className="mt-4" onClick={onAddChoiceClick}>
        Add choice
      </Button>
    </div>
  );
};

const useChoiceField = () => {
  const {question} = useQuestionContext();
  const onAddChoiceClick = () => {
    insertQuestionChoice({
      questionId: question.id,
    });
  };

  const onChoiceChange = (choiceId: string, value: string) => {
    updateQuestionChoice({
      questionId: question.id,
      newChoice: {
        id: choiceId,
        value,
      },
    });
  };

  const onChoiceDelete = (choiceId: string) => {
    deleteQuestionChoice({
      questionId: question.id,
      choiceId,
    });
  };

  const onDuplicateChoice = (choiceId: string) => {
    duplicateQuestionChoice({
      questionId: question.id,
      choiceId,
    });
  };

  return {
    onAddChoiceClick,
    onChoiceChange,
    onChoiceDelete,
    onDuplicateChoice,
  };
};
