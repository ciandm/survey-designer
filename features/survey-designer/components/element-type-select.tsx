import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import {ELEMENT_OPTIONS} from '@/lib/constants/element';
import {SurveyElementType} from '@/types/element';
import {FieldType} from '@/types/field';
import {formatElementType} from '@/utils/survey';
import {ElementTypeIcon} from './element-type-icon';

const GROUPED_OPTIONS_WITHOUT_SCREENS = ELEMENT_OPTIONS.filter(
  ({group}) => group !== 'Screens',
);

type ElementTypeSelectProps = {
  id?: string;
  className?: string;
  type?: SurveyElementType;
  onChange: (type: FieldType) => void;
  onOpenChange?: (open: boolean) => void;
};

export const ElementTypeSelect = ({
  id,
  className,
  type,
  onChange,
  onOpenChange,
}: ElementTypeSelectProps) => {
  return (
    <Select
      value={type}
      onValueChange={(value) => onChange(value as FieldType)}
      onOpenChange={onOpenChange}
    >
      <SelectTrigger id={id} className={className}>
        <SelectValue placeholder="Select a element type">
          <div className="flex items-center">
            <div className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <ElementTypeIcon type={type} />
            </div>
            {formatElementType(type ?? 'short_text')}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent id={id}>
        {GROUPED_OPTIONS_WITHOUT_SCREENS.map(({group, options}) => {
          return (
            <SelectGroup key={group}>
              <SelectLabel>{group}</SelectLabel>
              {options.map((option) => {
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex w-full flex-1 items-center justify-between">
                      <ElementTypeIcon type={option.value} className="mr-2" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          );
        })}
      </SelectContent>
    </Select>
  );
};
