'use client';

import {PlusIcon} from '@heroicons/react/20/solid';
import {Button} from '@/components/ui/button';
import {cn} from '@/utils/classnames';
import {useActiveElement} from '../_hooks/use-active-element';
import {useElementCrud} from '../_hooks/use-element-crud';
import {useActiveElementActions} from '../_store/active-element-id-store';
import {useSurveyElements} from '../_store/survey-designer-store';

export const SurveyContent = () => {
  const elements = useSurveyElements();
  const {setActiveElementId} = useActiveElementActions();
  const {activeElement} = useActiveElement();
  const {handleCreateElement} = useElementCrud();

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
      <ul className="flex h-full flex-col items-stretch">
        {elements.map((element, index) => {
          const text = !!element.text ? element.text : '...';
          return (
            <li
              key={element.id}
              className={cn('w-full', {
                'bg-accent': activeElement?.id === element.id,
              })}
            >
              <button
                className="flex w-full items-center gap-3 px-2 py-3"
                onClick={() => setActiveElementId(element.id)}
              >
                <span className="flex items-center gap-2 rounded-sm bg-primary/30 px-2.5 py-1 text-xs font-medium text-primary">
                  {index + 1}
                </span>
                <span className="truncate text-xs">{text}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
