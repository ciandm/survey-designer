import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {ELEMENT_OPTIONS} from '@/lib/constants/element';
import {ElementType, SurveyElementTypes} from '@/types/element';
import {formatElementType} from '@/utils/survey';
import {ElementTypeIcon} from './element-type-icon';

const GROUPED_OPTIONS_WITHOUT_SCREENS = ELEMENT_OPTIONS.filter(
  ({group}) => group !== 'Screens',
);

type ElementTypeSelectProps = {
  id?: string;
  className?: string;
  type?: SurveyElementTypes;
  onChange: (type: ElementType) => void;
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
      onValueChange={(value) => onChange(value as ElementType)}
      onOpenChange={onOpenChange}
    >
      <SelectTrigger id={id} className={className}>
        <SelectValue placeholder="Select a element type">
          <div className="flex items-center">
            <ElementTypeIcon type={type} className="mr-2" />
            {formatElementType(type ?? 'short_text')}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent id={id}>
        {GROUPED_OPTIONS_WITHOUT_SCREENS.map(({group, options}) => {
          return (
            <>
              <SelectGroup>
                <SelectLabel key={group}>{group}</SelectLabel>
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
            </>
          );
        })}
      </SelectContent>
    </Select>
  );
};
