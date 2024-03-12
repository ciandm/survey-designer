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
import {FieldSchema, FieldType} from '@/types/field';
import {useSurveyStoreActions} from '../../_store/survey-designer-store';
import {SettingsField} from '../settings-field';
import {SettingsWrapper} from '../settings-wrapper';
import {ChoicesSettings} from './components/choices-settings';

type FieldSettingsProps = {
  field: FieldSchema;
};

export const FieldSettings = ({field}: FieldSettingsProps) => {
  const storeActions = useSurveyStoreActions();
  const hasChoicesConfig =
    field?.type === 'multiple_choice' || field?.type === 'single_choice';

  const hasPlaceholder =
    field?.type === 'short_text' || field?.type === 'long_text';

  const handleChangeFieldType = (type: FieldType) => {
    storeActions.changeFieldType({
      id: field.id,
      type,
    });
  };

  return (
    <>
      <SettingsWrapper
        onChangeElementType={handleChangeFieldType}
        elementType={field.type}
      >
        <div className="overflow-auto">
          <div className="space-y-6 p-4">
            <SettingsField>
              <SettingsField.Label>Title</SettingsField.Label>
              <SettingsField.InputWrapper>
                <Textarea
                  key={`${field.text}-${field.id}-settings-title`}
                  defaultValue={field.text}
                  onBlur={(e) =>
                    storeActions.updateField({
                      id: field.id,
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
                  key={`${field.description}-${field.id}-settings-description`}
                  defaultValue={field.description}
                  onBlur={(e) =>
                    storeActions.updateField({
                      id: field.id,
                      description: e.target.value,
                    })
                  }
                />
              </SettingsField.InputWrapper>
            </SettingsField>
            {hasPlaceholder && (
              <SettingsField>
                <SettingsField.Label>
                  Placeholder (optional)
                </SettingsField.Label>
                <SettingsField.InputWrapper>
                  <Textarea
                    key={`${field.properties.placeholder}-${field.id}-settings-placeholder`}
                    defaultValue={field.properties.placeholder}
                    onBlur={(e) =>
                      storeActions.updateField({
                        id: field.id,
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
                    storeActions.updateField({
                      id: field.id,
                      validations: {
                        required: !!checked,
                      },
                    });
                  }}
                  id="settings-required"
                  checked={field.validations.required}
                />
                <Label htmlFor="settings-required">
                  Make this question required
                </Label>
              </div>
              {field.validations.required && (
                <div className="flex flex-col gap-2">
                  <div className="mt-3 flex items-center justify-between">
                    <Label htmlFor="required-error-message">
                      Required error message (optional)
                    </Label>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                          >
                            <HelpCircleIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <p className="text-xs leading-snug">
                            If the question is required, this message will be
                            shown if the user tries to submit the form without
                            answering this question. Defaults to &quot;This
                            field is required&quot;.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea
                    name="required"
                    id="required-error-message"
                    defaultValue={field.properties.required_message}
                    key={`${field.properties.required_message}-${field.id}-required-message`}
                    onBlur={(e) =>
                      storeActions.updateField({
                        id: field.id,
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
              <Separator className="my-4" />
              <div className="p-4">
                <ChoicesSettings field={field} />
              </div>
            </>
          )}
        </div>
      </SettingsWrapper>
    </>
  );
};
