import React from 'react';
import {PlusIcon} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';
import {Separator} from '@/components/ui/separator';
import {Textarea} from '@/components/ui/textarea';
import {useActiveElementActions} from '@/survey-designer/_store/active-element-id-store';
import {useDesignerActions} from '@/survey-designer/_store/survey-designer-store';
import {ElementSchemaType} from '@/types/element';
import {Choices, ChoicesAddChoice, ChoicesList} from '../choices';
import {QuestionTypeSelect} from '../question-type-select';

type QuestionEditorProps = {
  element: ElementSchemaType;
  index: number;
};

export const QuestionEditor = ({element, index}: QuestionEditorProps) => {
  const {changeElementType, updateElement} = useDesignerActions();
  const {setActiveElementId} = useActiveElementActions();

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="mb-2 mt-2 flex items-center justify-between gap-2 text-sm font-medium text-muted-foreground">
          <div className="flex flex-col">
            <div className="pointer-events-none flex items-center gap-2">
              <span>Question {index + 1}</span>
              <span>•</span>
              <Badge
                variant={element.validations.required ? 'default' : 'secondary'}
              >
                {element.validations.required ? 'Required' : 'Optional'}
              </Badge>
            </div>
          </div>
          <QuestionTypeSelect
            className="hidden h-9 w-auto gap-2 text-sm font-medium text-muted-foreground hover:bg-muted sm:flex"
            element={element}
            onChange={(type) =>
              changeElementType({
                id: element.id,
                type,
              })
            }
            onOpenChange={(open) => open && setActiveElementId(element.id)}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 rounded-md border border-input">
          <div className="overflow-hidden rounded-lg bg-white focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <label htmlFor="title" className="sr-only">
              Question title
            </label>
            <input
              name="title"
              id="title"
              className="block w-full border-0 bg-transparent px-2.5 pt-1 text-base font-medium outline-none placeholder:text-gray-400 focus:ring-0 md:text-lg "
              placeholder="Untitled question"
              defaultValue={element.text}
              key={`${element.text}-${element.id}-title`}
              onBlur={(e) =>
                updateElement({
                  id: element.id,
                  text: e.target.value,
                })
              }
              onKeyDown={handleKeyDown}
            />
            <label htmlFor="description" className="sr-only">
              Description
            </label>
            <textarea
              rows={2}
              name="description"
              id="description"
              className="block w-full resize-none border-0 bg-transparent px-2.5 py-0 pt-1 text-sm outline-none placeholder:text-gray-400 focus:ring-0 sm:leading-6"
              placeholder="Description (optional)"
              defaultValue={element.description}
              key={`${element.description}-${element.id}-description`}
              onBlur={(e) =>
                updateElement({
                  id: element.id,
                  description: e.target.value,
                })
              }
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </div>
      <Separator />
      {(element.type === 'multiple_choice' ||
        element.type === 'single_choice') && (
        <Choices elementId={element.id} choices={element.properties.choices}>
          <ChoicesList />
          <ChoicesAddChoice variant="outline" size="sm" className="mt-2">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add choice
          </ChoicesAddChoice>
        </Choices>
      )}
      {element.type === 'long_text' && (
        <Textarea
          readOnly
          placeholder={
            !!element.properties.placeholder
              ? element.properties.placeholder
              : 'Your answer here'
          }
        />
      )}
      {element.type === 'short_text' && (
        <Input
          readOnly
          placeholder={
            !!element.properties.placeholder
              ? element.properties.placeholder
              : 'Your answer here'
          }
        />
      )}
    </div>
  );
};
