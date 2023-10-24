'use client';

import {Control, Controller} from 'react-hook-form';
import {QuestionType} from '@prisma/client';
import * as Accordion from '@radix-ui/react-accordion';
import {ChevronDownIcon} from 'lucide-react';
import {formatQuestionType} from '@/lib/utils';
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

interface FormState {
  title: string;
  description: string;
  type: QuestionType;
}

interface OptionsProps {
  setHasDescription: (hasDescription: boolean) => void;
  hasDescription: boolean;
  control: Control<FormState>;
}

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

export const QuestionOptions = ({
  setHasDescription,
  hasDescription,
  control,
}: OptionsProps) => {
  const accordionMap: Record<AccordionValues, JSX.Element> = {
    general: (
      <GeneralOptions
        hasDescription={hasDescription}
        setHasDescription={setHasDescription}
        control={control}
      />
    ),
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

const GeneralOptions = ({
  control,
  hasDescription,
  setHasDescription,
}: OptionsProps) => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col gap-2">
        <Label>Question type</Label>
        <Controller
          control={control}
          name="type"
          render={({field}) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
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
          )}
        />
      </div>
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">Add a description</p>
          <p className="text-xs text-muted-foreground">
            Provide useful information to help your respondents answer the
            question
          </p>
        </div>
        <Switch
          onCheckedChange={(checked) => setHasDescription(checked)}
          checked={hasDescription}
        />
      </div>
    </div>
  );
};
