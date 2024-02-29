'use client';

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
import {useActiveElement} from '@/survey-dashboard/_hooks/use-active-element';
import {
  useDesignerActions,
  useSurveyElements,
  useSurveySchema,
  useSurveyScreens,
} from '@/survey-dashboard/_store/survey-designer-store';
import {
  Choices,
  ChoicesAddChoice,
  ChoicesField,
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

export const ConfigPanel = () => {
  const {activeElement} = useActiveElement();

  return (
    <ConfigPanelInner key={`${activeElement?.id}-${activeElement?.type}`} />
  );
};

const ConfigPanelInner = () => {
  const {activeElement} = useActiveElement();
  const elements = useSurveyElements();
  const {changeElementType, updateElement} = useDesignerActions();

  const choices = activeElement?.properties.choices ?? [];

  const hasChoicesConfig =
    activeElement?.type === 'multiple_choice' ||
    activeElement?.type === 'single_choice';
  const hasPlaceholderConfig =
    activeElement?.type === 'short_text' || activeElement?.type === 'long_text';

  if (!activeElement) {
    if (elements.length === 0) {
      return (
        <aside className="hidden max-w-sm flex-1 flex-col self-auto overflow-y-auto border-l bg-white p-4 lg:flex">
          <div className="flex justify-center p-4">
            <p className="text-center text-muted-foreground">
              Create a question to get started
            </p>
          </div>
        </aside>
      );
    }

    return (
      <aside className="hidden max-w-sm flex-1 flex-col self-auto overflow-y-auto border-l bg-white p-4 lg:flex">
        <SurveyGeneralSettings />
      </aside>
    );
  }

  return (
    <aside className="hidden max-w-sm flex-1 flex-col self-auto overflow-y-auto border-l bg-white p-4 lg:flex">
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
            element={activeElement}
            onChange={(type) =>
              changeElementType({
                id: activeElement.id,
                type,
              })
            }
            id="element-type"
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Textarea
            name="title"
            id="title"
            value={activeElement.text}
            onChange={(e) =>
              updateElement({
                id: activeElement.id,
                text: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            name="description"
            id="description"
            value={activeElement.description}
            onChange={(e) =>
              updateElement({
                id: activeElement.id,
                description: e.target.value,
              })
            }
          />
        </div>
        {hasPlaceholderConfig && (
          <div className="space-y-1.5">
            <Label htmlFor="placeholder">Placeholder (optional)</Label>
            <Textarea
              name="placeholder"
              id="placeholder"
              value={activeElement.properties.placeholder}
              onChange={(e) =>
                updateElement({
                  id: activeElement.id,
                  properties: {
                    placeholder: e.target.value,
                  },
                })
              }
            />
          </div>
        )}
        <div className="flex flex-col">
          <div className="flex items-center">
            <Checkbox
              className="mr-2"
              onCheckedChange={(checked) => {
                updateElement({
                  id: activeElement.id,
                  validations: {
                    required: !!checked,
                  },
                });
              }}
              id="required"
              checked={activeElement.validations.required}
            />
            <Label htmlFor="required">Make this question required</Label>
          </div>
          {activeElement.validations.required && (
            <>
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
                value={activeElement.properties.required_message}
                onChange={(e) =>
                  updateElement({
                    id: activeElement.id,
                    properties: {
                      required_message: e.target.value,
                    },
                  })
                }
              />
            </>
          )}
        </div>
      </div>
      {hasChoicesConfig && (
        <>
          <Separator className="my-6" />
          <div className="space-y-6">
            <div>
              <Choices elementId={activeElement.id} choices={choices}>
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
                <ChoicesList>
                  {choices.map((choice, index) => (
                    <ChoicesField
                      index={index}
                      choice={choice}
                      key={choice.id}
                    />
                  ))}
                </ChoicesList>
              </Choices>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sort-choices" className="text-sm font-medium">
                Sort choices
              </Label>
              <Select
                value={activeElement.properties.sort_order ?? 'none'}
                onValueChange={(value) => {
                  updateElement({
                    id: activeElement.id,
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
            <div className="space-y-1.5">
              <Label htmlFor="minimum-selection" className="mb-1">
                Minimum selection (UI-TODO)
              </Label>
              <Input disabled type="number" id="minimum-selection" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="maximum-selection" className="mb-1">
                Maximum selection (UI-TODO)
              </Label>
              <Input type="number" id="maximum-selection" disabled />
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

const SurveyGeneralSettings = () => {
  const schema = useSurveySchema();
  const {thank_you, welcome} = useSurveyScreens();
  const {updateTitle, updateDescription, updateScreen} = useDesignerActions();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold leading-7">Survey</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Configure your survey settings
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="survey-title">Title</Label>
        <Textarea
          id="survey-title"
          key={schema.title}
          defaultValue={schema.title}
          onBlur={(e) => updateTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
            }
          }}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="survey-description">Description</Label>
        <Textarea
          id="survey-description"
          key={schema.description}
          defaultValue={schema.description}
          onBlur={(e) => updateDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
            }
          }}
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
          <Label htmlFor="welcome-message">Welcome message</Label>
          <Textarea
            id="welcome-message"
            defaultValue={welcome.message ?? ''}
            key={welcome.message}
            onBlur={(e) => updateScreen('welcome', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="completed-message">Thank you message</Label>
          <Textarea
            key={thank_you.message}
            defaultValue={thank_you.message ?? ''}
            id="completed-message"
            onBlur={(e) => updateScreen('thank_you', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
