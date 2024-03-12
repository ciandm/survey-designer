import {PlusCircledIcon} from '@radix-ui/react-icons';
import {Label} from '@radix-ui/react-label';
import {EraserIcon} from 'lucide-react';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {ELEMENT_CHOICE_SORT_ORDER_OPTIONS} from '@/lib/constants/element';
import {FieldSchema} from '@/types/field';
import {useSurveyStoreActions} from '../../../_store/survey-designer-store';
import {AddChoiceButton} from '../../choices/add-choice-button';
import {Choices} from '../../choices/choices';
import {ChoicesList} from '../../choices/choices-list';
import {RemoveAllChoicesButton} from '../../choices/remove-all-choices-button';
import {SettingsField} from '../../settings-field';

export const ChoicesSettings = ({field}: {field: FieldSchema}) => {
  const {updateField: updateElement} = useSurveyStoreActions();
  const choices = field.properties.choices ?? [];

  const handleMinimumSelectionBlur = (value: string, field: FieldSchema) => {
    const minSelections = parseInt(value);

    updateElement({
      id: field.id,
      validations: {
        min_selections: minSelections,
      },
    });
  };

  const handleMaximumSelectionBlur = (value: string, field: FieldSchema) => {
    const currentMaxSelections = field.validations.max_selections ?? 0;
    const currentMinSelections = field.validations.min_selections ?? 0;
    const maxSelections = parseInt(value);

    if (currentMaxSelections === maxSelections) return;

    let newMinSelections = currentMinSelections;

    if (maxSelections === 0) {
      newMinSelections = currentMinSelections;
    } else if (currentMinSelections > maxSelections) {
      newMinSelections = maxSelections;
    }

    updateElement({
      id: field.id,
      validations: {
        max_selections: maxSelections,
        min_selections: newMinSelections,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Choices fieldId={field.id} choices={choices}>
          <div className="mb-2 grid grid-cols-[1fr_40px_40px] items-center justify-between gap-2">
            <p className="text-sm font-medium">Choices</p>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <RemoveAllChoicesButton size="icon" variant="ghost">
                    <EraserIcon className="h-5 w-5" />
                  </RemoveAllChoicesButton>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-xs leading-snug">Delete choices</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AddChoiceButton variant="ghost" size="icon">
                    <PlusCircledIcon className="h-5 w-5" />
                  </AddChoiceButton>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-xs leading-snug">Add choice</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ChoicesList />
        </Choices>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sort-choices" className="text-sm font-medium">
          Sort choices
        </Label>
        <Select
          value={field.properties.sort_order ?? 'none'}
          onValueChange={(value) => {
            updateElement({
              id: field.id,
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
            <SettingsField.Label>Minimum selection</SettingsField.Label>
            <SettingsField.InputWrapper>
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
            </SettingsField.InputWrapper>
          </SettingsField>
          <SettingsField>
            <SettingsField.Label>Maximum selection</SettingsField.Label>
            <SettingsField.InputWrapper>
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
            </SettingsField.InputWrapper>
          </SettingsField>
        </>
      )}
    </div>
  );
};
