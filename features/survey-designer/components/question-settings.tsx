'use client';

import {QuestionType} from '@prisma/client';
import {Input} from '@/components/ui/input';
import {SwitchSetting} from '@/features/survey-designer/components/switch-setting';
import {QuestionConfig} from '@/lib/validations/question';
import {useActiveQuestion} from '../hooks/use-active-question';
import {useQuestionActions} from '../store/questions';

type PropertySettingKey = Exclude<
  keyof QuestionConfig['properties'],
  'choices'
>;

type ValidationSettingKey = keyof QuestionConfig['validations'];

export const QuestionSettings = () => {
  const {updateQuestion} = useQuestionActions();
  const {activeQuestion} = useActiveQuestion();

  if (!activeQuestion) return null;

  return (
    <div className="p-4">
      <p className="mb-4 text-sm font-medium leading-none">Settings</p>
      <div className="flex flex-col gap-4">
        {validationSettingsMap[activeQuestion.type].map((setting) => {
          if (setting === 'min_characters' || setting === 'max_characters') {
            return (
              <SwitchSetting
                label={keyToLabelMap[setting]}
                defaultChecked={!!activeQuestion.validations[setting]}
                setting={setting}
                key={setting}
                onCheckedChange={(checked) => {
                  if (!checked) {
                    updateQuestion({
                      id: activeQuestion.id,
                      validations: {
                        [setting]: null,
                      },
                    });
                  }
                }}
              >
                {(isChecked) => (
                  <>
                    {isChecked && (
                      <div className="flex w-full flex-row items-center gap-4">
                        <Input
                          type="number"
                          className="w-full rounded-md border px-2 py-1 text-sm"
                          max={999}
                          min={0}
                          placeholder="0-999"
                          onChange={(event) => {
                            updateQuestion({
                              id: activeQuestion.id,
                              validations: {
                                [setting]: parseInt(event.target.value, 10),
                              },
                            });
                          }}
                          value={activeQuestion.validations[setting] ?? ''}
                        />
                      </div>
                    )}
                  </>
                )}
              </SwitchSetting>
            );
          }

          return (
            <SwitchSetting
              label={keyToLabelMap[setting]}
              setting={setting}
              key={setting}
              id={setting}
              checked={!!activeQuestion.validations[setting]}
              onCheckedChange={(checked) => {
                updateQuestion({
                  id: activeQuestion.id,
                  validations: {
                    [setting]: checked,
                  },
                });
              }}
            />
          );
        })}
        {propertySettingsMap[activeQuestion.type].map((setting) => {
          if (setting === 'placeholder') {
            return (
              <SwitchSetting
                label={keyToLabelMap[setting]}
                defaultChecked={!!activeQuestion.properties[setting]}
                setting={setting}
                key={setting}
                onCheckedChange={(checked) => {
                  if (!checked) {
                    updateQuestion({
                      id: activeQuestion.id,
                      properties: {
                        [setting]: '',
                      },
                    });
                  }
                }}
              >
                {(isChecked) => (
                  <>
                    {isChecked && (
                      <div className="flex w-full flex-row items-center gap-4">
                        <Input
                          className="w-full rounded-md border px-2 py-1 text-sm"
                          onChange={(event) => {
                            updateQuestion({
                              id: activeQuestion.id,
                              properties: {
                                [setting]: event.target.value,
                              },
                            });
                          }}
                          value={activeQuestion.properties[setting] ?? ''}
                        />
                      </div>
                    )}
                  </>
                )}
              </SwitchSetting>
            );
          }

          return (
            <SwitchSetting
              label={keyToLabelMap[setting]}
              setting={setting}
              key={setting}
              id={setting}
              checked={!!activeQuestion.properties[setting]}
              onCheckedChange={(checked) => {
                updateQuestion({
                  id: activeQuestion.id,
                  properties: {
                    [setting]: checked,
                  },
                });
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const propertySettingsMap: Record<QuestionType, PropertySettingKey[]> = {
  SHORT_TEXT: ['placeholder'],
  LONG_TEXT: ['placeholder'],
  MULTIPLE_CHOICE: [
    'allow_other_option',
    'allow_multiple_selection',
    'randomise',
  ],
  SINGLE_CHOICE: ['randomise', 'allow_other_option'],
};

const validationSettingsMap: Record<QuestionType, ValidationSettingKey[]> = {
  SHORT_TEXT: ['required', 'max_characters'],
  LONG_TEXT: ['required', 'max_characters'],
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
    placeholder: 'Custom placeholder',
  };
