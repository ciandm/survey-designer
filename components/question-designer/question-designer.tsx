'use client';

import {QuestionType} from '@prisma/client';
import {Copy, Plus, Trash} from 'lucide-react';
import {v4 as uuidv4} from 'uuid';
import {
  useActiveQuestion,
  useSurveyFieldActions,
} from '../survey-schema-initiailiser';
import {Button} from '../ui/button';
import {Input} from '../ui/input';
import {Textarea} from '../ui/textarea';

export const QuestionDesigner = ({children}: {children: React.ReactNode}) => {
  const {activeQuestionIndex} = useActiveQuestion();
  return (
    <div className="flex w-full flex-col border-2 border-transparent bg-white p-4 shadow-md">
      <div className="flex justify-between">
        <p className="mb-1 text-sm text-muted-foreground">
          {activeQuestionIndex + 1}
          {/* {selectedField.validations.required && '(required)'} */}
        </p>
      </div>
      {/* <>{questionTypeMap[selectedField.type]}</> */}
      {children}
    </div>
  );
};

export const TextQuestion = () => {
  const {activeQuestion} = useActiveQuestion();
  const {updateQuestion} = useSurveyFieldActions();

  const InputComponent =
    activeQuestion?.type === QuestionType.SHORT_TEXT ? Input : Textarea;

  return (
    <InputComponent
      type="text"
      name="name"
      id="name"
      placeholder={
        !!activeQuestion?.properties.placeholder
          ? activeQuestion.properties.placeholder
          : 'Your answer here...'
      }
      onChange={(e) =>
        updateQuestion({
          id: activeQuestion?.id ?? '',
          properties: {placeholder: e.target.value},
        })
      }
      readOnly
    />
  );
};

export const ChoicesQuestion = () => {
  const {activeQuestion} = useActiveQuestion();
  const {updateQuestion} = useSurveyFieldActions();

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
    <div className="flex flex-col items-start gap-1">
      {activeQuestion?.properties.choices?.map((choice) => (
        <div key={choice.id} className="flex justify-start gap-2">
          <div className="relative mt-2 flex items-center">
            <Input
              type="text"
              placeholder="Enter a choice"
              className="py-1.5 pr-24 sm:text-sm sm:leading-6"
              value={choice.value}
              onChange={(e) => onChoiceChange(choice.id, e.target.value)}
            />
            <div className="absolute right-0 flex gap-2 py-1.5 pr-1.5">
              <Button
                className="h-8 w-8"
                size="icon"
                variant="ghost"
                disabled={activeQuestion.properties.choices?.length === 1}
                onClick={() => handleRemoveChoice(choice.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
              <Button
                className="h-8 w-8"
                size="icon"
                variant="ghost"
                onClick={() => handleDuplicateChoice(choice.id)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      {activeQuestion?.properties.allow_other_option && (
        <div className="relative mt-2 flex items-center">
          <Input
            type="text"
            readOnly
            defaultValue="Other"
            className="py-1.5 pr-24 sm:text-sm sm:leading-6"
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
