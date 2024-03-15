import {PlusCircledIcon} from '@radix-ui/react-icons';
import {EraserIcon} from 'lucide-react';
import {Label} from '@/components/ui/label';
import {Separator} from '@/components/ui/separator';
import {Switch} from '@/components/ui/switch';
import {Textarea} from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {FieldSchema} from '@/types/field';
import {
  Choices,
  ChoicesAddChoice,
  ChoicesList,
  ChoicesRemoveAll,
} from '../choices';
import {
  SettingsField,
  SettingsFieldInputWrapper,
  SettingsFieldLabel,
} from '../settings-field';
import {SettingsShell} from '../settings-shell';
import {ChoicesOptions} from './components/choices-options';
import {getHasChoicesConfig, getHasPlaceholder} from './field-settings.utils';
import {useFieldSettings} from './use-field-settings';

type FieldSettingsProps = {
  field: FieldSchema;
};

export const FieldSettings = ({field}: FieldSettingsProps) => {
  const {
    handleChangeDescription,
    handleChangeFieldType,
    handleChangePlaceholder,
    handleChangeTitle,
    handleCheckedChange,
  } = useFieldSettings(field);

  const hasChoicesConfig = getHasChoicesConfig(field);
  const hasPlaceholder = getHasPlaceholder(field);

  return (
    <>
      <SettingsShell
        onChangeElementType={handleChangeFieldType}
        elementType={field.type}
      >
        <div className="overflow-auto">
          <div className="space-y-6 p-4">
            <div className="flex items-center">
              <Switch
                className="mr-2"
                onCheckedChange={handleCheckedChange}
                id="settings-required"
                checked={field.validations.required}
              />
              <Label htmlFor="settings-required">Required</Label>
            </div>
            <SettingsField>
              <SettingsFieldLabel>Title</SettingsFieldLabel>
              <SettingsFieldInputWrapper>
                <Textarea value={field.text} onChange={handleChangeTitle} />
              </SettingsFieldInputWrapper>
            </SettingsField>
            <SettingsField>
              <SettingsFieldLabel>Description (optional)</SettingsFieldLabel>
              <SettingsFieldInputWrapper>
                <Textarea
                  value={field.description}
                  onChange={handleChangeDescription}
                />
              </SettingsFieldInputWrapper>
            </SettingsField>
            {hasPlaceholder && (
              <SettingsField>
                <SettingsFieldLabel>Placeholder (optional)</SettingsFieldLabel>
                <SettingsFieldInputWrapper>
                  <Textarea
                    value={field.properties.placeholder}
                    onChange={handleChangePlaceholder}
                  />
                </SettingsFieldInputWrapper>
              </SettingsField>
            )}
          </div>
          {hasChoicesConfig && (
            <>
              <Separator className="my-4" />
              <div className="p-4">
                <ChoicesOptions field={field}>
                  <Choices
                    fieldId={field.id}
                    choices={field.properties.choices}
                  >
                    <div className="mb-2 grid grid-cols-[1fr_40px_40px] items-center justify-between gap-2">
                      <p className="text-sm font-medium">Choices</p>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <ChoicesRemoveAll size="icon" variant="ghost">
                              <EraserIcon className="h-5 w-5" />
                            </ChoicesRemoveAll>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs">
                            <p className="text-xs leading-snug">
                              Delete choices
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <ChoicesAddChoice variant="ghost" size="icon">
                              <PlusCircledIcon className="h-5 w-5" />
                            </ChoicesAddChoice>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs">
                            <p className="text-xs leading-snug">Add choice</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <ChoicesList />
                  </Choices>
                </ChoicesOptions>
              </div>
            </>
          )}
        </div>
      </SettingsShell>
    </>
  );
};
