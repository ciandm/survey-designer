'use client';

import ContentEditable from 'react-contenteditable';
import TextareaAutosize from 'react-textarea-autosize';
import {QuestionType} from '@prisma/client';
import {cn} from '@/lib/utils';
import {FieldConfig} from '@/lib/validations/question';
import {updateQuestion} from '@/stores/survey-schema';
import {useSurveySchemaActions} from '../survey-schema-initiailiser';
import {Input} from '../ui/input';
import {Separator} from '../ui/separator';
import {Textarea} from '../ui/textarea';

export const QuestionDesigner = ({field}: {field: FieldConfig}) => {
  const {updateField: updateQuestion} = useSurveySchemaActions();
  const questionTypeMap = {
    [QuestionType.SHORT_TEXT]: <TextQuestion field={field} />,
    [QuestionType.LONG_TEXT]: <TextQuestion field={field} />,
    [QuestionType.MULTIPLE_CHOICE]: <ChoicesQuestion />,
    [QuestionType.SINGLE_CHOICE]: <ChoicesQuestion />,
  };

  return (
    <div className="flex w-full flex-col border-2 border-transparent bg-white p-4 shadow-md">
      <div className="flex justify-between">
        <p className="mb-1 text-sm text-muted-foreground">
          Question {1} {field.properties.required && '(required)'}
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

const ChoicesQuestion = () => {
  return null;

  // return (
  //   <div className="flex flex-col gap-2">
  //     {fields.map((field, index) => (
  //       <div key={field.id} className="flex gap-2">
  //         <Input // important to include key with field's id
  //           placeholder="Enter a choice"
  //           {...field}
  //         />
  //         <Button
  //           size="icon"
  //           variant="ghost"
  //           onClick={() => remove(index)}
  //           disabled={fields.length === 1}
  //         >
  //           <Trash className="h-4 w-4" />
  //         </Button>
  //       </div>
  //     ))}
  //     <Button
  //       variant="outline"
  //       className="mt-2 self-start"
  //     >
  //       <Plus className="mr-2 h-4 w-4" />
  //       Add a choice
  //     </Button>
  //   </div>
  // );
};
