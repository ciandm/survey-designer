import {Button} from '@/components/ui/button';
import {ELEMENT_OPTIONS} from '@/lib/constants/element';
import {useSurveyScreens} from '@/survey-designer/_store/survey-designer-store';
import {ElementGroup, ElementType, ScreenType} from '@/types/element';
import {ElementTypeIcon} from '../../element-type-icon';

type ElementCategoriesGridProps = {
  onOptionClick: (group: ElementGroup, type: ElementType | ScreenType) => void;
};

export const ElementCategoriesGrid = ({
  onOptionClick,
}: ElementCategoriesGridProps) => {
  const screens = useSurveyScreens();

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
  type: ElementType | ScreenType,
  screens: ReturnType<typeof useSurveyScreens>,
) => {
  if (group === 'Screens') {
    if (type === 'welcome_screen') {
      return screens.welcome.length > 0;
    }
    if (type === 'thank_you_screen') {
      return screens.thank_you.length > 0;
    }
  }
  return false;
};
