import {Input} from '@/components/ui/input';
import {Separator} from '@/components/ui/separator';
import {Textarea} from '@/components/ui/textarea';
import {ElementType, ScreenSchema} from '@/types/element';
import {
  useSurveyModel,
  useSurveyStoreActions,
} from '../../../_store/survey-designer-store';
import {useDesignerHandlers} from '../../designer/designer.context';
import {SettingsField} from './settings-field';
import {SettingsWrapper} from './settings-wrapper';

type ScreenSettingsProps = {
  element: ScreenSchema;
};

export const ScreenSettings = ({element}: ScreenSettingsProps) => {
  const {updateScreen, removeScreen} = useSurveyStoreActions();
  const {handleCreateElement} = useDesignerHandlers();

  const key = element.type === 'thank_you_screen' ? 'thank_you' : 'welcome';

  const handleOnChangeElementType = (type: ElementType) => {
    removeScreen(key, element.id);
    handleCreateElement({type, index: 0});
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
                updateScreen(key, element.id, {
                  text: e.target.value,
                })
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
                updateScreen(key, element.id, {
                  description: e.target.value,
                })
              }
            />
          </SettingsField.InputWrapper>
        </SettingsField>
        <SettingsField>
          <SettingsField.Label>Button label</SettingsField.Label>
          <SettingsField.InputWrapper>
            <Input
              key={`${element.text}-${element.id}-settings-button`}
              defaultValue={element.properties.button_label ?? ''}
              onBlur={(e) =>
                updateScreen(key, element.id, {
                  properties: {
                    button_label: e.target.value,
                  },
                })
              }
            />
          </SettingsField.InputWrapper>
        </SettingsField>
      </div>
    </SettingsWrapper>
  );
};
