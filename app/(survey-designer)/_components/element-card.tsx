import React from 'react';
import {CopyIcon, PlusIcon, Settings, Trash2Icon} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Separator} from '@/components/ui/separator';
import {Switch} from '@/components/ui/switch';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';
import {ElementSchemaType} from '@/types/element';
import {useElementCrud} from '../_hooks/use-element-crud';
import {setActiveElementRef} from '../_store/active-element-ref';
import {useDesignerActions} from '../_store/survey-designer-store';
import {Choices, ChoicesAddChoice, ChoicesList} from './choices';
import {ElementListProps} from './element-list';
import {QuestionTypeSelect} from './question-type-select';

type ElementCardProps = Pick<ElementListProps, 'onSettingsClick'> & {
  isActive: boolean;
  element: ElementSchemaType;
  index: number;
};

export const ElementCard = ({
  isActive,
  element,
  index,
  onSettingsClick,
}: ElementCardProps) => {
  const {handleRemoveElement, handleDuplicateElement} = useElementCrud();
  const {changeElementType, updateElement} = useDesignerActions();

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        setActiveElementRef(element.ref);
      }}
      tabIndex={0}
      className={cn(
        'group flex-1 cursor-pointer overflow-hidden border-t-8 bg-card shadow-sm ring-ring ring-offset-2 transition-colors',
        {
          'border-t-primary': isActive,
          'hover:border-t-primary/30': !isActive,
        },
      )}
    >
      <div className="flex flex-col gap-6 px-6 pb-2 pt-4">
        <div className="flex flex-col gap-2">
          <div className="mb-2 mt-2 flex justify-between gap-2 text-sm font-medium text-muted-foreground">
            <div className="pointer-events-none flex items-center gap-2">
              <span>Question {index + 1}</span>
              <span>•</span>
              <Badge
                variant={element.validations.required ? 'default' : 'secondary'}
              >
                {element.validations.required ? 'Required' : 'Optional'}
              </Badge>
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
              onOpenChange={(open) => open && setActiveElementRef(element.ref)}
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 rounded-md border border-input">
            <div className="overflow-hidden rounded-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <label htmlFor="title" className="sr-only">
                Question title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="block w-full border-0 bg-transparent px-2.5 pt-1 text-base font-medium outline-none placeholder:text-gray-400 focus:ring-0 md:text-lg "
                placeholder="Untitled question"
                defaultValue={element.text}
                key={`${element.text}-${element.id}-title`}
                onBlur={(e) => {
                  updateElement({
                    id: element.id,
                    text: e.target.value,
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
              />
              <label htmlFor="description" className="sr-only">
                Description
              </label>
              <textarea
                rows={2}
                name="description"
                id="description"
                className="mt-1 block w-full resize-none border-0 bg-transparent px-2.5 py-0 text-sm outline-none placeholder:text-gray-400 focus:ring-0 sm:leading-6"
                placeholder="Description (optional)"
                defaultValue={element.description}
                key={`${element.description}-${element.id}-description`}
                onBlur={(e) => {
                  updateElement({
                    id: element.id,
                    description: e.target.value,
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="mt-2 w-full pb-4">
          {(element.type === 'multiple_choice' ||
            element.type === 'single_choice') && (
            <>
              <Choices
                elementId={element.id}
                choices={element.properties.choices}
              >
                <ChoicesList />
                <ChoicesAddChoice variant="outline" size="sm" className="mt-2">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add choice
                </ChoicesAddChoice>
              </Choices>
            </>
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
        </div>
      </div>

      <footer className="border-t px-5 py-2.5">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={element.validations.required}
                onCheckedChange={(checked) =>
                  updateElement({
                    id: element.id,
                    validations: {
                      required: checked,
                    },
                  })
                }
              />
              <Label htmlFor="required">Required</Label>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="flex lg:hidden"
                size="icon"
                onClick={() => onSettingsClick((prev) => !prev)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicateElement(element.id);
                }}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveElement(element.id);
                }}
              >
                <Trash2Icon className=" h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
