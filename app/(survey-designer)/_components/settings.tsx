'use client';

import React from 'react';
import {EraserIcon, PlusCircledIcon} from '@radix-ui/react-icons';
import {HelpCircleIcon} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Separator} from '@/components/ui/separator';
import {Textarea} from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {useActiveElement} from '@/survey-designer/_hooks/use-active-element';
import {
  useDesignerActions,
  useSurveyModel,
  useSurveyScreens,
} from '@/survey-designer/_store/survey-designer-store';
import {ElementSchemaType} from '@/types/element';
import {useSettings} from '../_hooks/use-settings';
import {
  Choices,
  ChoicesAddChoice,
  ChoicesList,
  ChoicesRemoveAll,
} from './choices';
import {QuestionTypeSelect} from './question-type-select';

const SORT_ORDER_OPTIONS = [
  {label: 'None', value: 'none'},
  {label: 'Ascending', value: 'asc'},
  {label: 'Descending', value: 'desc'},
  {label: 'Random', value: 'random'},
] as const;

export const Settings = () => {
  const {activeElement} = useActiveElement();

  if (!activeElement) return <GeneralSettings />;

  const hasChoicesConfig =
    activeElement?.type === 'multiple_choice' ||
    activeElement?.type === 'single_choice';

  const key = `${activeElement?.id}-${activeElement?.type}`;

  return (
    <React.Fragment key={key}>
      <QuestionSettings element={activeElement} />
      {hasChoicesConfig && (
        <>
          <Separator className="my-8" />
          <ChoicesSettings element={activeElement} />
        </>
      )}
    </React.Fragment>
  );
};

const GeneralSettings = () => {
  const model = useSurveyModel();
  const {thank_you, welcome} = useSurveyScreens();
  const {updateTitle, updateDescription, updateScreen} = useDesignerActions();
  const {handleKeyDown} = useSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold leading-7">Survey</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Configure your survey settings
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="config-panel-survey-title">Title</Label>
        <Textarea
          id="config-panel-survey-title"
          key={model.title}
          defaultValue={model.title}
          onBlur={(e) => updateTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="config-panel-survey-description">
          Description (optional)
        </Label>
        <Textarea
          id="config-panel-survey-description"
          key={model.description}
          defaultValue={model.description}
          onBlur={(e) => updateDescription(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Separator />
      <div>
        <h2 className="text-base font-semibold leading-7">Screens</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Make changes to the screens for your survey
        </p>
      </div>
      <div className="space-y-6">
        <div className="space-y-1.5">
          <Label htmlFor="config-panel-welcome-message">Welcome message</Label>
          <Textarea
            id="config-panel-welcome-message"
            defaultValue={welcome.message ?? ''}
            key={welcome.message}
            onBlur={(e) => updateScreen('welcome', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="config-panel-thank-you-message">
            Thank you message
          </Label>
          <Textarea
            key={thank_you.message}
            defaultValue={thank_you.message ?? ''}
            id="config-panel-thank-you-message"
            onBlur={(e) => updateScreen('thank_you', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

const QuestionSettings = ({element}: {element: ElementSchemaType}) => {
  const {changeElementType, updateElement} = useDesignerActions();
  const {handleKeyDown} = useSettings();

  const hasPlaceholderConfig =
    element?.type === 'short_text' || element?.type === 'long_text';

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h2 className="text-base font-semibold leading-7">Question</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Make changes to the question
        </p>
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="element-type">Type</Label>
        <QuestionTypeSelect
          element={element}
          onChange={(type) =>
            changeElementType({
              id: element.id,
              type,
            })
          }
          id="element-type"
        />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="config-panel-title">Title</Label>
        <Textarea
          name="config-panel-title"
          id="config-panel-title"
          defaultValue={element.text}
          key={`${element.text}-${element.id}-config-panel-title`}
          onBlur={(e) =>
            updateElement({
              id: element.id,
              text: e.target.value,
            })
          }
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="config-panel-description">Description (optional)</Label>
        <Textarea
          name="config-panel-description"
          id="config-panel-description"
          defaultValue={element.description}
          key={`${element.description}-${element.id}-config-panel-description`}
          onBlur={(e) =>
            updateElement({
              id: element.id,
              description: e.target.value,
            })
          }
          onKeyDown={handleKeyDown}
        />
      </div>
      {hasPlaceholderConfig && (
        <div className="space-y-1.5">
          <Label htmlFor="config-panel-placeholder">
            Placeholder (optional)
          </Label>
          <Textarea
            name="config-panel-placeholder"
            id="config-panel-placeholder"
            defaultValue={element.properties.placeholder}
            key={`${element.properties.placeholder}-${element.id}-config-panel-placeholder`}
            onBlur={(e) =>
              updateElement({
                id: element.id,
                properties: {
                  placeholder: e.target.value,
                },
              })
            }
            onKeyDown={handleKeyDown}
          />
        </div>
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
            id="config-panel-required"
            checked={element.validations.required}
          />
          <Label htmlFor="config-panel-required">
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
                      If the question is required, this message will be shown if
                      the user tries to submit the form without answering this
                      question. Defaults to &quot;This field is required&quot;.
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
  );
};

const ChoicesSettings = ({element}: {element: ElementSchemaType}) => {
  const {updateElement} = useDesignerActions();
  const choices = element.properties.choices ?? [];

  const {handleMaximumSelectionBlur, handleMinimumSelectionBlur} =
    useSettings();

  return (
    <>
      <div className="space-y-6">
        <div>
          <Choices elementId={element.id} choices={choices}>
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
                    <p className="text-xs leading-snug">Delete choices</p>
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
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sort-choices" className="text-sm font-medium">
            Sort choices
          </Label>
          <Select
            value={element.properties.sort_order ?? 'none'}
            onValueChange={(value) => {
              updateElement({
                id: element.id,
                properties: {
                  sort_order: value === 'none' ? undefined : (value as any),
                },
              });
            }}
          >
            <SelectTrigger id="sort-choices">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SORT_ORDER_OPTIONS.map((option) => (
                  <SelectItem value={option.value} key={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {element.type === 'multiple_choice' && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="minimum-selection" className="mb-1">
                Minimum selection
              </Label>
              <Input
                type="number"
                id="minimum-selection"
                defaultValue={element.validations.min_selections ?? 0}
                max={choices.length}
                min={0}
                onBlur={(e) =>
                  handleMinimumSelectionBlur(e.target.value, element)
                }
                key={`${element.validations.min_selections}-${element.id}-minimum-selection`}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="maximum-selection" className="mb-1">
                Maximum selection
              </Label>
              <Input
                type="number"
                id="maximum-selection"
                min={0}
                max={choices.length}
                defaultValue={element.validations.max_selections ?? 0}
                onBlur={(e) =>
                  handleMaximumSelectionBlur(e.target.value, element)
                }
                key={`${element.validations.max_selections}-${element.id}-maximum-selection`}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};
