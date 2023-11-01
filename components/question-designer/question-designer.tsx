'use client';

import {QuestionType} from '@prisma/client';
import {Copy, Plus, Trash} from 'lucide-react';
import {v4 as uuidv4} from 'uuid';
import {FieldConfig} from '@/lib/validations/question';
import {updateQuestion} from '@/stores/survey-schema';
import {useSurveySchemaActions} from '../survey-schema-initiailiser';
import {Button} from '../ui/button';
import {Input} from '../ui/input';
import {Separator} from '../ui/separator';
import {Textarea} from '../ui/textarea';

export const QuestionDesigner = ({
  field,
  index,
}: {
  field: FieldConfig;
  index: number;
}) => {
  const {updateField: updateQuestion} = useSurveySchemaActions();
  const questionTypeMap = {
    [QuestionType.SHORT_TEXT]: <TextQuestion field={field} />,
    [QuestionType.LONG_TEXT]: <TextQuestion field={field} />,
    [QuestionType.MULTIPLE_CHOICE]: <ChoicesQuestion field={field} />,
    [QuestionType.SINGLE_CHOICE]: <ChoicesQuestion field={field} />,
  };

  return (
    <div className="flex w-full flex-col border-2 border-transparent bg-white p-4 shadow-md">
      <div className="flex justify-between">
        <p className="mb-1 text-sm text-muted-foreground">
          Question {index} {field.validations.required && '(required)'}
        </p>
      </div>
      <Input
        placeholder="Your question here..."
        value={field.text || ''}
        onChange={(e) => updateQuestion({id: field.id, text: e.target.value})}
      />
      <Input
        className="mt-4"
        placeholder="Description (optional)"
        value={field.description || ''}
        onChange={(e) =>
          updateQuestion({id: field.id, description: e.target.value})
        }
      />
      <Separator className="my-8" />
      <>{questionTypeMap[field.type]}</>
    </div>
  );
};

const TextQuestion = ({field}: {field: FieldConfig}) => {
  const InputComponent =
    field.type === QuestionType.SHORT_TEXT ? Input : Textarea;

  return (
    <InputComponent
      type="text"
      name="name"
      id="name"
      placeholder={
        !!field.properties.placeholder
          ? field.properties.placeholder
          : 'Your answer here...'
      }
      onChange={(e) =>
        updateQuestion({id: field.id, config: {placeholder: e.target.value}})
      }
      readOnly
    />
  );
};

const ChoicesQuestion = ({field}: {field: FieldConfig}) => {
  const {updateFieldChoices} = useSurveySchemaActions();
  const onChange = (value: string, choiceId: string) => {
    const choices =
      field.properties.choices?.map((choice) =>
        choice.id === choiceId ? {...choice, value} : choice,
      ) ?? [];
    updateFieldChoices({
      fieldId: field.id,
      choices,
    });
  };

  const onAddChoice = () => {
    const choices = [
      ...(field.properties.choices ?? []),
      {
        id: uuidv4(),
        value: '',
      },
    ];
    updateFieldChoices({
      fieldId: field.id,
      choices,
    });
  };

  const onDeleteChoice = (choiceId: string) => {
    const choices = field.properties.choices?.filter(
      (choice) => choice.id !== choiceId,
    );
    updateFieldChoices({
      fieldId: field.id,
      choices,
    });
  };

  const onDuplicateChoice = (choiceId: string) => {
    const copiedChoices = [...(field.properties.choices ?? [])];
    const copiedChoice = copiedChoices.find((choice) => choice.id === choiceId);

    if (!copiedChoice) return;

    const copiedChoiceIndex = copiedChoices.findIndex(
      (choice) => choice.id === choiceId,
    );

    const newChoices = [
      ...copiedChoices.slice(0, copiedChoiceIndex + 1),
      {
        id: uuidv4(),
        value: `${copiedChoice.value} (copy)`,
      },
      ...copiedChoices.slice(copiedChoiceIndex + 1),
    ];

    updateFieldChoices({
      fieldId: field.id,
      choices: newChoices,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {field.properties.choices?.map((choice) => (
        <div key={choice.id} className="flex gap-2">
          <Input // important to include key with field's id
            placeholder="Enter a choice"
            value={choice.value}
            onChange={(e) => onChange(e.target.value, choice.id)}
          />
          <Button
            size="icon"
            variant="ghost"
            disabled={field.properties.choices?.length === 1}
            onClick={() => onDeleteChoice(choice.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDuplicateChoice(choice.id)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        className="mt-2 self-start"
        onClick={onAddChoice}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add a choice
      </Button>
    </div>
  );
};
