import React from 'react';
import {PlusIcon} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {ElementSchemaType} from '@/types/element';
import {Choices, ChoicesAddChoice, ChoicesList} from '../choices/choices';

type QuestionTypeEditorProps = {
  element: ElementSchemaType;
};

export const QuestionTypeEditor = ({element}: QuestionTypeEditorProps) => {
  let content = null;

  switch (element.type) {
    case 'multiple_choice':
    case 'single_choice':
      content = (
        <>
          <Choices elementId={element.id} choices={element.properties.choices}>
            <ChoicesList />
            <ChoicesAddChoice variant="outline" size="sm" className="mt-2">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add choice
            </ChoicesAddChoice>
          </Choices>
        </>
      );
      break;
    case 'long_text':
    case 'short_text':
      const Component = element.type === 'long_text' ? Textarea : Input;
      content = (
        <Component
          readOnly
          placeholder={
            !!element.properties.placeholder
              ? element.properties.placeholder
              : 'Your answer here'
          }
        />
      );
      break;
    default:
      throw new Error('invalid type');
  }

  return <div className="mt-2 w-full pb-4">{content}</div>;
};
