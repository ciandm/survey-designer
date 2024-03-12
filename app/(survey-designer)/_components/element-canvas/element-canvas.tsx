import React from 'react';
import {PlusIcon} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {useSurveyElements} from '@/survey-designer/_store/survey-designer-store';
import {ElementSchema} from '@/types/element';
import {cn} from '@/utils/classnames';
import {AddChoiceButton} from '../choices/add-choice-button';
import {Choices} from '../choices/choices';
import {ChoicesList} from '../choices/choices-list';

type ElementCanvasProps = {
  element: ElementSchema;
  children?: React.ReactNode;
};

export const ElementCanvas = ({element, children}: ElementCanvasProps) => {
  const surveyElements = useSurveyElements();

  const index = surveyElements.findIndex((el) => el.id === element.id);

  return (
    <>
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-6 px-6 pb-2 pt-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Label
              className={cn('break-normal text-base font-medium leading-6', {
                [`after:content-['_*']`]: element.validations.required,
              })}
              htmlFor={`question-${element.id}`}
            >
              {index + 1}. {!!element.text ? element.text : 'Untitled question'}
            </Label>
            {!!element.description && (
              <p className="text-sm text-muted-foreground">
                {element.description}
              </p>
            )}
          </div>
          {(element.type === 'multiple_choice' ||
            element.type === 'single_choice') && (
            <Choices
              elementId={element.id}
              choices={element.properties.choices}
            >
              <ChoicesList />
              <AddChoiceButton variant="outline" size="sm" className="mt-2">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add choice
              </AddChoiceButton>
            </Choices>
          )}
          {element.type === 'long_text' && (
            <Textarea
              id={`question-${element.id}`}
              readOnly
              placeholder={element.properties.placeholder}
            />
          )}
          {element.type === 'short_text' && (
            <Input
              id={`question-${element.id}`}
              readOnly
              placeholder={element.properties.placeholder}
            />
          )}
        </div>
      </div>
      {children}
    </>
  );
};
