'use client';

import {PlusIcon} from '@heroicons/react/20/solid';
import {Button} from '@/components/ui/button';
import {ElementSchema, ScreenSchema, SurveyElementTypes} from '@/types/element';
import {cn} from '@/utils/classnames';
import {
  useSurveyElements,
  useSurveyScreens,
} from '../_store/survey-designer-store';
import {useDesignerHandlers} from './designer/designer.context';

type Props = {
  element: ElementSchema | ScreenSchema | null;
  handleSelectElement: (id: string, type: SurveyElementTypes) => void;
};

export const SurveyContent = ({handleSelectElement, element}: Props) => {
  const elements = useSurveyElements();
  const {welcome} = useSurveyScreens();
  const {handleCreateElement} = useDesignerHandlers();

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b px-2 py-3">
        <h3 className="text-sm font-medium text-foreground">Content</h3>
        <Button
          size="icon"
          variant="secondary"
          onClick={() => handleCreateElement()}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      <ul className="flex h-full w-full flex-col items-stretch">
        {welcome.length > 0 && (
          <li className="w-full">
            <ContentButton
              isActive={element?.id === welcome[0].id}
              onClick={() =>
                handleSelectElement(welcome[0].id, 'welcome_screen')
              }
            >
              <span className="flex items-center gap-2 rounded-sm bg-primary/30 px-2.5 py-1 text-xs font-medium text-primary">
                W
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
                onClick={() => handleSelectElement(el.id, el.type)}
              >
                <span className="flex items-center gap-2 rounded-sm bg-primary/30 px-2.5 py-1 text-xs font-medium text-primary">
                  {index + 1}
                </span>
                <span className="truncate text-xs">{text}</span>
              </ContentButton>
            </li>
          );
        })}
      </ul>
    </div>
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
