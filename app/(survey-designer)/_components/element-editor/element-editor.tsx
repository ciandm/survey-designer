import {PlusIcon} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {useSurveyFields} from '@/survey-designer/_store/survey-designer-store';
import {SurveyElementSchema} from '@/types/element';
import {cn} from '@/utils/classnames';
import {getIsField, getIsScreen} from '@/utils/survey';
import {AddChoiceButton} from '../choices/add-choice-button';
import {Choices} from '../choices/choices';
import {ChoicesList} from '../choices/choices-list';

type ElementEditorProps = {
  element: SurveyElementSchema | null;
  children: React.ReactNode;
};

export const ElementEditor = ({element, children}: ElementEditorProps) => {
  const surveyElements = useSurveyFields();
  const index = surveyElements.findIndex((el) => el.id === element?.id);

  if (!element) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col">
      {getIsScreen(element) && (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">
              {element.text}
            </h1>
            {element.description && (
              <p className="text-sm leading-6 text-gray-600">
                {!!element.description
                  ? element.description
                  : 'Description (optional)'}
              </p>
            )}
          </div>
          {element.type === 'welcome_screen' && (
            <>
              <Button size="lg">{element.properties.button_label}</Button>
            </>
          )}
        </div>
      )}
      {getIsField(element) && (
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-6 px-6 pb-2 pt-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <Label
                className={cn('break-normal text-base font-medium leading-6', {
                  [`after:content-['_*']`]: element.validations.required,
                })}
                htmlFor={`question-${element.id}`}
              >
                {index + 1}.{' '}
                {!!element.text ? element.text : 'Untitled question'}
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
                fieldId={element.id}
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
      )}
      {children}
    </div>
  );
};
