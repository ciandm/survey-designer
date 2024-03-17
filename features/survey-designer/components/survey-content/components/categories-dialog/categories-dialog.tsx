import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {ElementTypeIcon} from '@/features/survey-designer/components/element-type-icon';
import {useDesignerStoreScreens} from '@/features/survey-designer/store/designer-store';
import {ELEMENT_OPTIONS} from '@/lib/constants/element';
import {ElementGroup} from '@/types/element';
import {FieldType} from '@/types/field';
import {ScreenType} from '@/types/screen';
import {getIsCategoryButtonDisabled} from './categories-dialog.utils';

type CategoriesDialogProps = {
  onOptionClick: (group: ElementGroup, type: FieldType | ScreenType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const CategoriesDialog = ({
  onOptionClick,
  isOpen,
  setIsOpen,
}: CategoriesDialogProps) => {
  const screens = useDesignerStoreScreens();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add content to your survey</DialogTitle>
          <DialogDescription>
            Add questions, screens, and more to your survey.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
              {ELEMENT_OPTIONS.map(({group, options}) => (
                <div key={group} className="flex flex-col gap-2">
                  <h4 className="ml-3 text-sm font-medium text-muted-foreground">
                    {group}
                  </h4>
                  {options.map((option) => {
                    const isDisabled = getIsCategoryButtonDisabled(
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
