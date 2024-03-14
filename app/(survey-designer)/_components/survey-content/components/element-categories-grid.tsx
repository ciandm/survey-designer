import {isEmpty} from 'lodash';
import {Button} from '@/components/ui/button';
import {ELEMENT_OPTIONS} from '@/lib/constants/element';
import {useDesignerStoreScreens} from '@/survey-designer/_store/designer-store/designer-store';
import {ElementGroup} from '@/types/element';
import {FieldType} from '@/types/field';
import {ScreenType} from '@/types/screen';
import {ElementTypeIcon} from '../../element-type-icon';

type ElementCategoriesGridProps = {
  onOptionClick: (group: ElementGroup, type: FieldType | ScreenType) => void;
};

export const ElementCategoriesGrid = ({
  onOptionClick,
}: ElementCategoriesGridProps) => {
  const screens = useDesignerStoreScreens();

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
        {ELEMENT_OPTIONS.map(({group, options}) => (
          <div key={group} className="flex flex-col gap-2">
            <h4 className="ml-3 text-sm font-medium text-muted-foreground">
              {group}
            </h4>
            {options.map((option) => {
              const isDisabled = getIsButtonDisabled(
                group,
                option.value,
                screens,
              );
              return (
                <Button
                  key={option.value}
                  disabled={isDisabled}
                  onClick={() => onOptionClick(group, option.value)}
                  variant="ghost"
                  className="justify-start gap-2"
                >
                  <ElementTypeIcon type={option.value} />
                  {option.label}
                </Button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const getIsButtonDisabled = (
  group: ElementGroup,
  type: FieldType | ScreenType,
  screens: ReturnType<typeof useDesignerStoreScreens>,
) => {
  if (group === 'Screens') {
    if (type === 'welcome_screen') {
      return !isEmpty(screens.welcome.data);
    }
    if (type === 'thank_you_screen') {
      return !isEmpty(screens.thank_you.data);
    }
  }
  return false;
};
