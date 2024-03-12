import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {FieldType} from '@/types/field';
import {ScreenSchema} from '@/types/screen';
import {getStoreKeyForScreenType} from '@/utils/screen';
import {
  useSurveyFields,
  useSurveyStoreActions,
} from '../_store/survey-designer-store';
import {UseDesignerReturn} from './designer/use-designer';
import {SettingsField} from './settings-field';
import {SettingsWrapper} from './settings-wrapper';

type ScreenSettingsProps = {
  screen: ScreenSchema;
} & Pick<UseDesignerReturn['handlers'], 'handleCreateElement'>;

export const ScreenSettings = ({
  screen,
  handleCreateElement,
}: ScreenSettingsProps) => {
  const fields = useSurveyFields();
  const {updateScreen, removeScreen} = useSurveyStoreActions();

  const handleOnChangeElementType = (type: FieldType) => {
    const key = screen.type === 'welcome_screen' ? 'welcome' : 'thank_you';
    removeScreen({id: screen.id, key});
    const index = screen.type === 'welcome_screen' ? 0 : fields.length;
    handleCreateElement({type, index});
  };

  return (
    <SettingsWrapper
      elementType={screen.type}
      onChangeElementType={handleOnChangeElementType}
    >
      <div className="space-y-6 p-4">
        <SettingsField>
          <SettingsField.Label>Title</SettingsField.Label>
          <SettingsField.InputWrapper>
            <Textarea
              key={`${screen.text}-${screen.id}-settings-title`}
              defaultValue={screen.text}
              onBlur={(e) =>
                updateScreen(
                  {id: screen.id, key: getStoreKeyForScreenType(screen.type)},
                  {
                    text: e.target.value,
                  },
                )
              }
            />
          </SettingsField.InputWrapper>
        </SettingsField>
        <SettingsField>
          <SettingsField.Label>Description (optional)</SettingsField.Label>
          <SettingsField.InputWrapper>
            <Textarea
              key={`${screen.text}-${screen.id}-settings-description`}
              defaultValue={screen.description}
              onBlur={(e) =>
                updateScreen(
                  {id: screen.id, key: getStoreKeyForScreenType(screen.type)},
                  {
                    description: e.target.value,
                  },
                )
              }
            />
          </SettingsField.InputWrapper>
        </SettingsField>
        {screen.type === 'welcome_screen' && (
          <SettingsField>
            <SettingsField.Label>Button label</SettingsField.Label>
            <SettingsField.InputWrapper>
              <Input
                key={`${screen.text}-${screen.id}-settings-button`}
                defaultValue={screen.properties.button_label ?? ''}
                onBlur={(e) =>
                  updateScreen(
                    {
                      id: screen.id,
                      key: getStoreKeyForScreenType(screen.type),
                    },
                    {
                      properties: {
                        button_label: e.target.value,
                      },
                    },
                  )
                }
              />
            </SettingsField.InputWrapper>
          </SettingsField>
        )}
      </div>
    </SettingsWrapper>
  );
};
