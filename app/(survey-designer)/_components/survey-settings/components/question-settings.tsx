import {HelpCircleIcon} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {Separator} from '@/components/ui/separator';
import {Textarea} from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {ElementSchemaType} from '@/types/element';
import {useSurveyStoreActions} from '../../../_store/survey-designer-store';
import {QuestionTypeSelect} from '../../question-type-select';
import {ChoicesSettings} from './choices-settings';
import {SettingsField} from './settings-field';

type QuestionSettingsProps = {
  element: ElementSchemaType;
};

export const QuestionSettings = ({element}: QuestionSettingsProps) => {
  const {changeElementType, updateElement} = useSurveyStoreActions();
  const hasChoicesConfig =
    element?.type === 'multiple_choice' || element?.type === 'single_choice';

  const hasPlaceholder =
    element?.type === 'short_text' || element?.type === 'long_text';

  return (
    <>
      <div className="flex flex-col space-y-6">
        <SettingsField>
          {({id}) => (
            <>
              <SettingsField.Label>Type</SettingsField.Label>
              <QuestionTypeSelect
                element={element}
                onChange={(type) =>
                  changeElementType({
                    id: element.id,
                    type,
                  })
                }
                id={id}
              />
            </>
          )}
        </SettingsField>
        <SettingsField>
          <SettingsField.Label>Title</SettingsField.Label>
          <SettingsField.InputWrapper>
            <Textarea
              key={`${element.text}-${element.id}-settings-title`}
              defaultValue={element.text}
              onBlur={(e) =>
                updateElement({
                  id: element.id,
                  text: e.target.value,
                })
              }
            />
          </SettingsField.InputWrapper>
        </SettingsField>
        <SettingsField>
          <SettingsField.Label>Description (optional)</SettingsField.Label>
          <SettingsField.InputWrapper>
            <Textarea
              key={`${element.description}-${element.id}-settings-description`}
              defaultValue={element.description}
              onBlur={(e) =>
                updateElement({
                  id: element.id,
                  description: e.target.value,
                })
              }
            />
          </SettingsField.InputWrapper>
        </SettingsField>
        {hasPlaceholder && (
          <SettingsField>
            <SettingsField.Label>Placeholder (optional)</SettingsField.Label>
            <SettingsField.InputWrapper>
              <Textarea
                key={`${element.properties.placeholder}-${element.id}-settings-placeholder`}
                defaultValue={element.properties.placeholder}
                onBlur={(e) =>
                  updateElement({
                    id: element.id,
                    properties: {
                      placeholder: e.target.value,
                    },
                  })
                }
              />
            </SettingsField.InputWrapper>
          </SettingsField>
        )}
        <div className="flex flex-col">
          <div className="flex items-center">
            <Checkbox
              className="mr-2"
              onCheckedChange={(checked) => {
                updateElement({
                  id: element.id,
                  validations: {
                    required: !!checked,
                  },
                });
              }}
              id="settings-required"
              checked={element.validations.required}
            />
            <Label htmlFor="settings-required">
              Make this question required
            </Label>
          </div>
          {element.validations.required && (
            <div className="flex flex-col gap-2">
              <div className="mt-3 flex items-center justify-between">
                <Label htmlFor="required-error-message">
                  Required error message (optional)
                </Label>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-6 w-6">
                        <HelpCircleIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p className="text-xs leading-snug">
                        If the question is required, this message will be shown
                        if the user tries to submit the form without answering
                        this question. Defaults to &quot;This field is
                        required&quot;.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Textarea
                name="required"
                id="required-error-message"
                defaultValue={element.properties.required_message}
                key={`${element.properties.required_message}-${element.id}-required-message`}
                onBlur={(e) =>
                  updateElement({
                    id: element.id,
                    properties: {
                      required_message: e.target.value,
                    },
                  })
                }
              />
            </div>
          )}
        </div>
      </div>
      {hasChoicesConfig && (
        <>
          <Separator className="my-8" />
          <ChoicesSettings element={element} />
        </>
      )}
    </>
  );
};
