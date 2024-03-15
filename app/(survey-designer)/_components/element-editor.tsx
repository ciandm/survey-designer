import {useId} from 'react';
import {PlusIcon} from 'lucide-react';
import {FieldElement} from '@/components/field-element';
import {ScreenElement} from '@/components/screen-element';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useElementIndex} from '@/survey-designer/_hooks/use-element-index';
import {SurveyElementSchema} from '@/types/element';
import {getIsField, getIsScreen} from '@/utils/survey';
import {Choices, ChoicesAddChoice, ChoicesList} from './choices';

type ElementEditorProps = {
  element: SurveyElementSchema | null;
  children: React.ReactNode;
};

export const ElementEditor = ({element, children}: ElementEditorProps) => {
  const index = useElementIndex(element);
  const id = useId();

  return (
    <div className="flex flex-1 flex-col">
      {getIsScreen(element) && (
        <ScreenElement screen={element}>
          {element.type === 'welcome_screen' && (
            <Button className="mt-8" size="lg">
              {element.properties.button_label}
            </Button>
          )}
        </ScreenElement>
      )}
      {getIsField(element) && (
        <FieldElement index={index} field={element} id={id} isReadonly>
          {(element.type === 'multiple_choice' ||
            element.type === 'single_choice') && (
            <Choices fieldId={element.id} choices={element.properties.choices}>
              <ChoicesList />
              <ChoicesAddChoice variant="outline" size="sm" className="mt-2">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add choice
              </ChoicesAddChoice>
            </Choices>
          )}
          {element.type === 'long_text' && (
            <Textarea
              id={id}
              readOnly
              placeholder={element.properties.placeholder}
            />
          )}
          {element.type === 'short_text' && (
            <Input
              id={id}
              readOnly
              placeholder={element.properties.placeholder}
            />
          )}
        </FieldElement>
      )}
      {children}
    </div>
  );
};
