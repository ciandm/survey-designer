'use client';

import {QuestionType} from '@prisma/client';
import {Plus, Trash} from 'lucide-react';
import {ChoicesConfig, FieldConfig} from '@/lib/validations/question';
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
    [QuestionType.MULTIPLE_CHOICE]: (
      <ChoicesQuestion choices={field.properties.choices} />
    ),
    [QuestionType.SINGLE_CHOICE]: (
      <ChoicesQuestion choices={field.properties.choices} />
    ),
  };

  return (
    <div className="flex w-full flex-col border-2 border-transparent bg-white p-4 shadow-md">
      <div className="flex justify-between">
        <p className="mb-1 text-sm text-muted-foreground">
          Question {index} {field.properties.required && '(required)'}
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

const ChoicesQuestion = ({choices = []}: {choices?: ChoicesConfig}) => {
  return (
    <div className="flex flex-col gap-2">
      {choices.map((choice, index) => (
        <div key={choice.id} className="flex gap-2">
          <Input // important to include key with field's id
            placeholder="Enter a choice"
            value={choice.value}
          />
          <Button size="icon" variant="ghost" disabled={choices.length === 1}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" className="mt-2 self-start">
        <Plus className="mr-2 h-4 w-4" />
        Add a choice
      </Button>
    </div>
  );
};
