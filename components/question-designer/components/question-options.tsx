'use client';

import React, {useState} from 'react';
import {QuestionType} from '@prisma/client';
import {useSurveySchemaActions} from '@/components/survey-schema-initiailiser';
import {Input} from '@/components/ui/input';
import {formatQuestionType} from '@/lib/utils';
import {FieldConfig} from '@/lib/validations/question';
import {useSelectedField} from '@/stores/selected-field';
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

type PropertySettingKey = Exclude<
  keyof FieldConfig['properties'],
  'choices' | 'placeholder'
>;

type ValidationSettingKey = keyof FieldConfig['validations'];

const questionTypeOptions = Object.values(QuestionType).map((value) => ({
  value,
  label: formatQuestionType(value),
}));

export const QuestionOptions = () => {
  const field = useSelectedField();
  if (!field) return null;

  return (
    <React.Fragment key={field.id}>
      <QuestionTypeOption field={field} />
      <QuestionSettings field={field} />
    </React.Fragment>
  );
};

const QuestionTypeOption = ({field}: {field: FieldConfig}) => {
  const {updateField} = useSurveySchemaActions();

  return (
    <div className="border-b p-4">
      <p className="mb-4 text-sm font-medium leading-none">Type</p>
      <Select
        value={field?.type}
        onValueChange={(value) =>
          updateField({id: field.id, type: value as QuestionType})
        }
      >
        <SelectTrigger id="question-type" className="mt-2">
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
  );
};

const QuestionSettings = ({field}: {field: FieldConfig}) => {
  const {updateField} = useSurveySchemaActions();

  return (
    <div className="p-4">
      <p className="mb-4 text-sm font-medium leading-none">Settings</p>
      <div className="flex flex-col gap-4">
        {validationSettingsMap[field.type].map((setting) => {
          if (setting === 'min_characters' || setting === 'max_characters') {
            return (
              <TextLengthSetting
                setting={setting}
                field={field}
                key={setting}
              />
            );
          }

          return (
            <Setting setting={setting} key={setting}>
              <Switch
                id={setting}
                checked={!!field.validations[setting]}
                onCheckedChange={(checked) => {
                  updateField({
                    id: field.id,
                    validations: {
                      [setting]: checked,
                    },
                  });
                }}
              />
            </Setting>
          );
        })}
        {propertySettingsMap[field.type].map((setting) => (
          <Setting setting={setting} key={setting}>
            <Switch
              id={setting}
              checked={!!field.properties[setting]}
              onCheckedChange={(checked) => {
                updateField({
                  id: field.id,
                  properties: {
                    [setting]: checked,
                  },
                });
              }}
            />
          </Setting>
        ))}
      </div>
    </div>
  );
};

const TextLengthSetting = ({
  setting,
  field,
}: {
  setting: 'min_characters' | 'max_characters';
  field: FieldConfig;
}) => {
  const [isOpen, setIsOpen] = useState(!!field.validations[setting]);
  const {updateFieldValidations} = useSurveySchemaActions();

  const onCheckedChange = (checked: boolean) => {
    setIsOpen(checked);
    if (!checked) {
      updateFieldValidations({
        fieldId: field.id,
        validations: {
          [setting]: undefined,
        },
      });
    }
  };

  return (
    <>
      <Setting setting={setting} key={setting}>
        <Switch
          id={setting}
          checked={isOpen}
          onCheckedChange={onCheckedChange}
        />
      </Setting>
      {isOpen && (
        <div className="flex w-full flex-row items-center gap-4">
          <Input
            type="number"
            className="w-full rounded-md border px-2 py-1 text-sm"
            value={field.validations[setting] || ''}
            placeholder="0-999"
            onChange={(event) => {
              updateFieldValidations({
                fieldId: field.id,
                validations: {
                  [setting]: Number(event.target.value),
                },
              });
            }}
          />
        </div>
      )}
    </>
  );
};

const Setting = ({
  setting,
  children,
}: React.PropsWithChildren<{
  setting: PropertySettingKey | ValidationSettingKey;
}>) => {
  return (
    <div
      className="flex flex-row items-center justify-between gap-4"
      key={setting}
    >
      <div className="space-y-0.5">
        <Label htmlFor={setting} className="text-sm font-normal">
          {keyToLabelMap[setting]}
        </Label>
      </div>
      {children}
    </div>
  );
};

const propertySettingsMap: Record<QuestionType, PropertySettingKey[]> = {
  SHORT_TEXT: [],
  LONG_TEXT: [],
  MULTIPLE_CHOICE: [
    'allow_other_option',
    'allow_multiple_selection',
    'randomise',
  ],
  SINGLE_CHOICE: ['randomise', 'allow_other_option'],
};

const validationSettingsMap: Record<QuestionType, ValidationSettingKey[]> = {
  SHORT_TEXT: ['required', 'min_characters', 'max_characters'],
  LONG_TEXT: ['required', 'min_characters', 'max_characters'],
  MULTIPLE_CHOICE: ['required'],
  SINGLE_CHOICE: ['required'],
};

const keyToLabelMap: Record<PropertySettingKey | ValidationSettingKey, string> =
  {
    allow_other_option: 'Allow other option',
    allow_multiple_selection: 'Allow multiple selection',
    randomise: 'Randomise',
    required: 'Required',
    max_characters: 'Max characters',
    min_characters: 'Min characters',
  };
