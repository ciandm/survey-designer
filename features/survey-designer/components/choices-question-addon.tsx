'use client';

import {Plus, Trash, XCircle} from 'lucide-react';
import {v4 as uuidv4} from 'uuid';
import {Checkbox} from '@/components/ui/checkbox';
import {Button} from '../../../components/ui/button';
import {useActiveQuestion} from '../hooks/use-active-question';
import {useSurveyQuestionsActions} from '../store/survey-designer';
import {ContentEditable} from './content-editable';

export const ChoicesQuestionAddon = () => {
  const {activeQuestion} = useActiveQuestion();
  const {updateQuestion} = useSurveyQuestionsActions();

  const handleRemoveChoice = (choiceId: string) => {
    const copiedField = {...activeQuestion};

    if (!copiedField.properties?.choices?.length) return;

    copiedField.properties.choices = copiedField.properties?.choices?.filter(
      (choice) => choice.id !== choiceId,
    );

    updateQuestion({
      id: activeQuestion?.id ?? '',
      properties: copiedField.properties,
    });
  };

  const handleDuplicateChoice = (choiceId: string) => {
    const copiedField = {...activeQuestion};

    if (!copiedField.properties?.choices?.length) return;

    const choice = copiedField.properties?.choices?.find(
      (choice) => choice.id === choiceId,
    );

    if (!choice) return;

    const index = copiedField.properties.choices.findIndex(
      (choice) => choice.id === choiceId,
    );

    copiedField.properties.choices.splice(index + 1, 0, {
      id: uuidv4(),
      value: choice?.value ? `${choice.value} (copy)` : '',
    });

    updateQuestion({
      id: activeQuestion?.id ?? '',
      properties: copiedField.properties,
    });
  };

  const handleAddChoice = () => {
    const copiedField = {...activeQuestion};

    if (!copiedField.properties?.choices?.length) return;

    copiedField.properties.choices.push({
      id: copiedField.properties.choices.length.toString(),
      value: '',
    });

    updateQuestion({
      id: activeQuestion?.id ?? '',
      properties: copiedField.properties,
    });
  };

  const onChoiceChange = (choiceId: string, value: string) => {
    const copiedField = {...activeQuestion};

    if (!copiedField.properties?.choices?.length) return;

    const choice = copiedField.properties?.choices?.find(
      (choice) => choice.id === choiceId,
    );

    if (!choice) return;

    choice.value = value;

    updateQuestion({
      id: activeQuestion?.id ?? '',
      properties: copiedField.properties,
    });
  };
  return (
    <div className="flex flex-col gap-2">
      {activeQuestion?.properties.choices?.map((choice) => (
        <div
          key={choice.id}
          className=" gap-4 rounded-sm border border-blue-400 bg-blue-50 pl-4"
        >
          <div className="group relative flex w-full items-center gap-2">
            <Checkbox />
            <ContentEditable
              className="w-full bg-transparent p-2 pr-4 text-blue-800"
              placeholder="Enter a choice"
              html={choice.value ?? ''}
              onChange={(e) => onChoiceChange(choice.id, e.target.value)}
            />
            <button
              className="absolute -right-3 hidden h-6 w-6 items-center justify-center gap-2 rounded-full bg-foreground group-hover:flex"
              disabled={activeQuestion.properties.choices?.length === 1}
              onClick={() => handleRemoveChoice(choice.id)}
            >
              <XCircle color="white" />
            </button>
          </div>
        </div>
      ))}
      {activeQuestion?.properties.allow_other_option && (
        <div className="flex items-center gap-4">
          <Checkbox />
          <ContentEditable
            html="Other"
            disabled
            onChange={(e) => {}}
            defaultValue="Other"
            className="py-1.5 pr-24 text-blue-900 sm:text-sm sm:leading-6"
          />
          <div className="absolute right-0 flex gap-2 py-1.5 pr-1.5">
            <Button
              className="h-8 w-8"
              size="icon"
              variant="ghost"
              disabled={activeQuestion.properties.choices?.length === 1}
              onClick={() =>
                updateQuestion({
                  id: activeQuestion.id,
                  properties: {allow_other_option: false},
                })
              }
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <ContentEditable
        html=""
        placeholder="Add a choice"
        onChange={(e) => {}}
      />
      <Button
        variant="outline"
        className="mt-4 self-start"
        onClick={handleAddChoice}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add a choice
      </Button>
    </div>
  );
};
