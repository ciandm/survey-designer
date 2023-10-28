'use client';

import {QuestionType} from '@prisma/client';
import * as Accordion from '@radix-ui/react-accordion';
import {ChevronDownIcon} from 'lucide-react';
import {useSurveySchemaActions} from '@/components/survey-schema-initiailiser';
import {Input} from '@/components/ui/input';
import {Separator} from '@/components/ui/separator';
import {formatQuestionType} from '@/lib/utils';
import {useSelectedField} from '@/stores/selected-field.ts';
import {Label} from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import {Switch} from '../../ui/switch';

type AccordionValues = 'general' | 'validation';

const accordionOptions: {label: string; value: AccordionValues}[] = [
  {
    label: 'General',
    value: 'general',
  },
  {
    label: 'Validation',
    value: 'validation',
  },
];

const questionTypeOptions = Object.values(QuestionType).map((value) => ({
  value,
  label: formatQuestionType(value),
}));

export const QuestionOptions = () => {
  const accordionMap: Record<AccordionValues, JSX.Element> = {
    general: <GeneralOptions />,
    validation: <p>Validation options</p>,
  };
  return (
    <>
      <Accordion.Root type="multiple" defaultValue={['general']}>
        {accordionOptions.map((option) => (
          <Accordion.Item key={option.value} value={option.value}>
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between bg-slate-50 p-4 text-left">
                <p className="text-sm font-medium">{option.label}</p>
                <ChevronDownIcon
                  size="16"
                  className="AccordionChevron transition-transform duration-150 ease-in-out group-data-[state='open']:rotate-180"
                  aria-hidden
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="px-4 py-6">
              {accordionMap[option.value]}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </>
  );
};

const GeneralOptions = () => {
  const field = useSelectedField();
  const {updateField: updateQuestion} = useSurveySchemaActions();

  if (!field) return null;

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="question-type" className="text-xs">
          Question type
        </Label>
        <Select
          value={field.type}
          onValueChange={(value) =>
            updateQuestion({id: field.id, type: value as QuestionType})
          }
        >
          <SelectTrigger id="question-type">
            <SelectValue placeholder="Select a question type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Simple</SelectLabel>
              {questionTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="placeholder" className="text-xs">
          Placeholder
        </Label>
        <Input
          id="placeholder"
          type="text"
          value={field.properties.placeholder}
          onChange={(event) =>
            updateQuestion({
              id: field.id,
              properties: {placeholder: event.target.value},
            })
          }
        />
      </div>
      <Separator />
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-0.5">
          <Label htmlFor="required" className="text-xs">
            Required
          </Label>
        </div>
        <Switch
          id="required"
          checked={!!field.properties.required}
          onCheckedChange={(checked) => {
            updateQuestion({
              id: field.id,
              properties: {required: checked, skippable: false},
            });
          }}
        />
      </div>
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-0.5">
          <Label htmlFor="skippable" className="text-xs">
            Skippable {field.properties.required && '(disabled)'}
          </Label>
        </div>
        <Switch
          id="skippable"
          checked={field.properties.skippable}
          disabled={field.properties.required}
          onCheckedChange={(checked) => {
            updateQuestion({id: field.id, properties: {skippable: checked}});
          }}
        />
      </div>
    </div>
  );
};
