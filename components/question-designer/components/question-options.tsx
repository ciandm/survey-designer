'use client';

import React, {useState} from 'react';
import {QuestionType} from '@prisma/client';
import {
  useActiveField,
  useSurveyFieldActions,
} from '@/components/survey-schema-initiailiser';
import {Input} from '@/components/ui/input';
import {formatQuestionType} from '@/lib/utils';
import {QuestionConfig} from '@/lib/validations/question';
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
  keyof QuestionConfig['properties'],
  'choices' | 'placeholder'
>;

type ValidationSettingKey = keyof QuestionConfig['validations'];

const questionTypeOptions = Object.values(QuestionType).map((value) => ({
  value,
  label: formatQuestionType(value),
}));

export const QuestionOptions = ({
  typeOptionComponent,
  settingsComponent,
}: {
  typeOptionComponent: React.ReactNode;
  settingsComponent: React.ReactNode;
}) => {
  return (
    <>
      {typeOptionComponent}
      {settingsComponent}
    </>
  );
};

export const QuestionTypeOption = () => {
  const {changeQuestionType} = useSurveyFieldActions();
  const {activeField} = useActiveField();

  const onChangeFieldType = (newType: QuestionType) => {
    changeQuestionType({
      id: activeField?.id ?? '',
      type: newType,
    });
  };

  return (
    <div className="border-b p-4">
      <p className="mb-4 text-sm font-medium leading-none">Type</p>
      <Select
        value={activeField?.type ?? QuestionType.SHORT_TEXT}
        onValueChange={(value) => onChangeFieldType(value as QuestionType)}
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

export const QuestionSettings = () => {
  const {updateQuestion} = useSurveyFieldActions();
  const {activeField} = useActiveField();

  if (!activeField) return null;

  return (
    <div className="p-4">
      <p className="mb-4 text-sm font-medium leading-none">Settings</p>
      <div className="flex flex-col gap-4">
        {validationSettingsMap[activeField.type].map((setting) => {
          if (setting === 'min_characters' || setting === 'max_characters') {
            return (
              <TextLengthSetting
                setting={setting}
                key={setting}
                onCheckedChange={(checked) => {
                  if (!checked) {
                    updateQuestion({
                      id: activeField.id,
                      validations: {
                        [setting]: null,
                      },
                    });
                  }
                }}
              >
                {({isOpen}) =>
                  isOpen && (
                    <div className="flex w-full flex-row items-center gap-4">
                      <Input
                        max={999}
                        min={0}
                        type="number"
                        className="w-full rounded-md border px-2 py-1 text-sm"
                        value={activeField.validations[setting] ?? ''}
                        placeholder="0-999"
                        onChange={(event) => {
                          updateQuestion({
                            id: activeField.id,
                            validations: {
                              [setting]: event.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                  )
                }
              </TextLengthSetting>
            );
          }

          return (
            <Setting setting={setting} key={setting}>
              <Switch
                id={setting}
                checked={!!activeField.validations[setting]}
                onCheckedChange={(checked) => {
                  updateQuestion({
                    id: activeField.id,
                    validations: {
                      [setting]: checked,
                    },
                  });
                }}
              />
            </Setting>
          );
        })}
        {propertySettingsMap[activeField.type].map((setting) => (
          <Setting setting={setting} key={setting}>
            <Switch
              id={setting}
              checked={!!activeField.properties[setting]}
              onCheckedChange={(checked) => {
                updateQuestion({
                  id: activeField.id,
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
  children,
  onCheckedChange: onCheckedChangeProp,
}: {
  setting: 'min_characters' | 'max_characters';
  children: ({isOpen}: {isOpen: boolean}) => React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
}) => {
  const {activeField} = useActiveField();
  const [isOpen, setIsOpen] = useState(
    !!activeField?.validations[setting] ?? false,
  );

  const onCheckedChange = (checked: boolean) => {
    setIsOpen(checked);
    onCheckedChangeProp?.(checked);
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
      {children({isOpen})}
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
