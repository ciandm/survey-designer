'use client';

import {useState} from 'react';
import {PlusIcon} from '@heroicons/react/20/solid';
import {DialogTitle} from '@radix-ui/react-dialog';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogHeader} from '@/components/ui/dialog';
import {ELEMENT_OPTIONS} from '@/lib/constants/element';
import {
  ElementSchema,
  ElementType,
  ScreenSchema,
  ScreenType,
} from '@/types/element';
import {cn} from '@/utils/classnames';
import {getStoreKeyForScreenType} from '@/utils/screen';
import {
  useSurveyElements,
  useSurveyScreens,
} from '../_store/survey-designer-store';
import {useDesignerHandlers} from './designer/designer.context';
import {ElementTypeIcon} from './element-type-icon';

type Props = {
  element: ElementSchema | ScreenSchema | null;
};

export const SurveyContent = ({element}: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const elements = useSurveyElements();
  const {welcome, thank_you} = useSurveyScreens();
  const {handleCreateElement, handleSelectElement, handleCreateScreen} =
    useDesignerHandlers();

  const handleCreateElementClick = ({type}: {type: ElementType}) => {
    handleCreateElement({type});
    setIsDialogOpen(false);
  };

  const handleCreateScreenClick = ({type}: {type: ScreenType}) => {
    handleCreateScreen({
      key: getStoreKeyForScreenType(type),
    });
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b px-2 py-3">
          <h3 className="text-sm font-medium text-foreground">Content</h3>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setIsDialogOpen(true)}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        <ul className="flex h-full w-full flex-col items-stretch">
          {welcome.length > 0 && (
            <li className="w-full">
              <ContentButton
                isActive={element?.id === welcome[0].id}
                onClick={() => handleSelectElement(welcome[0].id)}
              >
                <span className="flex items-center gap-2 rounded-sm bg-primary/30 px-2.5 py-1 text-xs font-medium text-primary">
                  <ElementTypeIcon type="welcome_screen" />
                </span>
                <span className="truncate text-xs">Welcome screen</span>
              </ContentButton>
            </li>
          )}
          {elements.map((el, index) => {
            const text = !!el.text ? el.text : '...';
            return (
              <li
                key={el.id}
                className={cn('w-full', {
                  'bg-accent': element?.id === el.id,
                })}
              >
                <ContentButton
                  isActive={element?.id === el.id}
                  onClick={() => handleSelectElement(el.id)}
                >
                  <span className="flex items-center gap-2 rounded-sm bg-primary/30 px-2.5 py-1 text-xs font-medium text-primary">
                    <ElementTypeIcon type={el.type} />
                    {index + 1}
                  </span>
                  <span className="truncate text-xs">{text}</span>
                </ContentButton>
              </li>
            );
          })}
          {thank_you.length > 0 && (
            <li className="w-full">
              <ContentButton
                isActive={element?.id === thank_you[0].id}
                onClick={() => handleSelectElement(thank_you[0].id)}
              >
                <span className="flex items-center gap-2 rounded-sm bg-primary/30 px-2.5 py-1 text-xs font-medium text-primary">
                  T
                </span>
                <span className="truncate text-xs">Thank you screen</span>
              </ContentButton>
            </li>
          )}
        </ul>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add content to your survey</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-3">
              {ELEMENT_OPTIONS.map(({group, options}) => (
                <div key={group} className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold text-foreground">
                    {group}
                  </h4>
                  {options.map((option) => {
                    const isDisabled =
                      group === 'Screens' &&
                      ((option.value === 'welcome_screen' &&
                        welcome.length > 0) ||
                        (option.value === 'thank_you_screen' &&
                          thank_you.length > 0));
                    return (
                      <Button
                        key={option.value}
                        disabled={isDisabled}
                        onClick={() =>
                          group !== 'Screens'
                            ? handleCreateElementClick({
                                type: option.value as ElementType,
                              })
                            : handleCreateScreenClick({
                                type: option.value as ScreenType,
                              })
                        }
                        variant="outline"
                        className="gap-2"
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
        </DialogContent>
      </Dialog>
    </>
  );
};

type ContentButtonProps = {
  children?: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
};

const ContentButton = ({children, onClick, isActive}: ContentButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 px-2 py-3',
        isActive && 'bg-accent',
      )}
    >
      {children}
    </button>
  );
};
