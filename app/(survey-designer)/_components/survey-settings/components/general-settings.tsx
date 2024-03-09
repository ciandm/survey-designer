import {Separator} from '@/components/ui/separator';
import {Textarea} from '@/components/ui/textarea';
import {
  useDesignerActions,
  useSurveyModel,
  useSurveyScreens,
} from '../../../_store/survey-designer-store';
import {SettingsField} from './settings-field';

export const GeneralSettings = () => {
  const model = useSurveyModel();
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
      <SettingsField>
        <SettingsField.Label>Title</SettingsField.Label>
        <SettingsField.InputWrapper>
          <Textarea
            key={model.title}
            defaultValue={model.title}
            onBlur={(e) => updateTitle(e.target.value)}
          />
        </SettingsField.InputWrapper>
      </SettingsField>
      <SettingsField>
        <SettingsField.Label>Description (optional)</SettingsField.Label>
        <SettingsField.InputWrapper>
          <Textarea
            key={model.description}
            defaultValue={model.description}
            onBlur={(e) => updateDescription(e.target.value)}
          />
        </SettingsField.InputWrapper>
      </SettingsField>
      <Separator />
      <div>
        <h2 className="text-base font-semibold leading-7">Screens</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Make changes to the screens for your survey
        </p>
      </div>
      <div className="space-y-6">
        <SettingsField>
          <SettingsField.Label>Welcome message</SettingsField.Label>
          <SettingsField.InputWrapper>
            <Textarea
              key={welcome.message}
              defaultValue={welcome.message ?? ''}
              onBlur={(e) => updateScreen('welcome', e.target.value)}
            />
          </SettingsField.InputWrapper>
        </SettingsField>
        <SettingsField>
          <SettingsField.Label>Thank you message</SettingsField.Label>
          <SettingsField.InputWrapper>
            <Textarea
              key={thank_you.message}
              defaultValue={thank_you.message ?? ''}
              onBlur={(e) => updateScreen('thank_you', e.target.value)}
            />
          </SettingsField.InputWrapper>
        </SettingsField>
      </div>
    </div>
  );
};
