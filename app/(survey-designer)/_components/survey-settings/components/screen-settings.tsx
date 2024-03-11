import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {ElementType, ScreenSchema} from '@/types/element';
import {getStoreKeyForScreenType} from '@/utils/screen';
import {
  useSurveyElements,
  useSurveyStoreActions,
} from '../../../_store/survey-designer-store';
import {useDesignerHandlers} from '../../designer/designer.context';
import {SettingsField} from './settings-field';
import {SettingsWrapper} from './settings-wrapper';

type ScreenSettingsProps = {
  element: ScreenSchema;
};

export const ScreenSettings = ({element}: ScreenSettingsProps) => {
  const elements = useSurveyElements();
  const {updateScreen, removeScreen} = useSurveyStoreActions();
  const {handleCreateElement} = useDesignerHandlers();

  const handleOnChangeElementType = (type: ElementType) => {
    const key = element.type === 'welcome_screen' ? 'welcome' : 'thank_you';
    removeScreen({id: element.id, key});
    const index = element.type === 'welcome_screen' ? 0 : elements.length;
    handleCreateElement({type, index});
  };

  return (
    <SettingsWrapper
      elementType={element.type}
      onChangeElementType={handleOnChangeElementType}
    >
      <div className="space-y-6 p-4">
        <SettingsField>
          <SettingsField.Label>Title</SettingsField.Label>
          <SettingsField.InputWrapper>
            <Textarea
              key={`${element.text}-${element.id}-settings-title`}
              defaultValue={element.text}
              onBlur={(e) =>
                updateScreen(
                  {id: element.id, key: getStoreKeyForScreenType(element.type)},
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
              key={`${element.text}-${element.id}-settings-description`}
              defaultValue={element.description}
              onBlur={(e) =>
                updateScreen(
                  {id: element.id, key: getStoreKeyForScreenType(element.type)},
                  {
                    description: e.target.value,
                  },
                )
              }
            />
          </SettingsField.InputWrapper>
        </SettingsField>
        {element.type === 'welcome_screen' && (
          <SettingsField>
            <SettingsField.Label>Button label</SettingsField.Label>
            <SettingsField.InputWrapper>
              <Input
                key={`${element.text}-${element.id}-settings-button`}
                defaultValue={element.properties.button_label ?? ''}
                onBlur={(e) =>
                  updateScreen(
                    {
                      id: element.id,
                      key: getStoreKeyForScreenType(element.type),
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
