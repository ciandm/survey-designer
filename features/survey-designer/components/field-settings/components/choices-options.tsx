import {Label} from '@radix-ui/react-label';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SettingsField,
  SettingsFieldInputWrapper,
  SettingsFieldLabel,
} from '@/features/survey-designer/components/settings-field';
import {useDesignerStoreActions} from '@/features/survey-designer/store/designer-store';
import {ELEMENT_CHOICE_SORT_ORDER_OPTIONS} from '@/lib/constants/element';
import {FieldSchema} from '@/types/field';
import {useChoicesOptions} from './use-choices-options';

type ChoicesOptionsProps = {
  field: FieldSchema;
  children: React.ReactNode;
};

export const ChoicesOptions = ({field, children}: ChoicesOptionsProps) => {
  const storeActions = useDesignerStoreActions();
  const choices = field.properties.choices ?? [];
  const {handleMaximumSelectionBlur, handleMinimumSelectionBlur} =
    useChoicesOptions();

  return (
    <div className="space-y-6">
      <div>{children}</div>
      <div className="space-y-1.5">
        <Label htmlFor="sort-choices" className="text-sm font-medium">
          Sort choices
        </Label>
        <Select
          value={field.properties.sort_order ?? 'none'}
          onValueChange={(value) => {
            storeActions.fields.updateField(field.id, {
              properties: {
                sort_order: value === 'none' ? undefined : (value as any),
              },
            });
          }}
        >
          <SelectTrigger id="sort-choices">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {ELEMENT_CHOICE_SORT_ORDER_OPTIONS.map((option) => (
                <SelectItem value={option.value} key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {field.type === 'multiple_choice' && (
        <>
          <SettingsField>
            <SettingsFieldLabel>Minimum selection</SettingsFieldLabel>
            <SettingsFieldInputWrapper>
              <Input
                type="number"
                defaultValue={field.validations.min_selections ?? 0}
                max={choices.length}
                min={0}
                onBlur={(e) =>
                  handleMinimumSelectionBlur(e.target.value, field)
                }
                key={`${field.validations.min_selections}-${field.id}-minimum-selection`}
              />
            </SettingsFieldInputWrapper>
          </SettingsField>
          <SettingsField>
            <SettingsFieldLabel>Maximum selection</SettingsFieldLabel>
            <SettingsFieldInputWrapper>
              <Input
                type="number"
                id="maximum-selection"
                min={0}
                max={choices.length}
                defaultValue={field.validations.max_selections ?? 0}
                onBlur={(e) =>
                  handleMaximumSelectionBlur(e.target.value, field)
                }
                key={`${field.validations.max_selections}-${field.id}-maximum-selection`}
              />
            </SettingsFieldInputWrapper>
          </SettingsField>
        </>
      )}
    </div>
  );
};
