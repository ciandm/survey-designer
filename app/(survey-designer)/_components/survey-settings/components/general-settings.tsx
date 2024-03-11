import {Separator} from '@/components/ui/separator';
import {Textarea} from '@/components/ui/textarea';
import {
  useSurveyModel,
  useSurveyStoreActions,
} from '../../../_store/survey-designer-store';
import {SettingsField} from './settings-field';

export const GeneralSettings = () => {
  const model = useSurveyModel();
  const {updateTitle, updateDescription} = useSurveyStoreActions();

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
    </div>
  );
};
