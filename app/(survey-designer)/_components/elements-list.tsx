'use client';

import {GripHorizontal} from 'lucide-react';
import {Sortable} from '@/components/sortable';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {useActiveElement} from '@/survey-designer/_hooks/use-active-element';
import {useSurveyElements} from '@/survey-designer/_store/survey-designer-store';
import {AddQuestion} from './add-question';
import {ElementCard} from './element-card';
import {ElementsEmptyState} from './elements-empty-state';

export const ElementsList = () => {
  const elements = useSurveyElements();
  const {activeElement} = useActiveElement();

  if (elements.length === 0) {
    return <ElementsEmptyState />;
  }

  return (
    <>
      {elements.map((element, index) => {
        const isActive = activeElement?.ref === element.ref;
        return (
          <Sortable
            key={element.id}
            id={element.id}
            className="flex w-full flex-1 items-center gap-2"
            isDisabled={elements.length === 1}
            renderSortHandle={({attributes, listeners, isSorting}) => (
              <Button
                size="icon"
                variant="ghost"
                {...attributes}
                {...listeners}
                className={cn(
                  'order-1 hidden items-center justify-center lg:flex',
                  isSorting ? 'cursor-grabbing' : 'cursor-grab',
                  {
                    'cursor-not-allowed': elements.length === 1,
                  },
                )}
              >
                <GripHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          >
            <ElementCard element={element} index={index} isActive={isActive} />
          </Sortable>
        );
      })}
      <div className="flex items-center gap-2 pr-12">
        <div className="h-[1px] flex-1 border-t" />
        <AddQuestion />
        <div className="h-[1px] flex-1 border-t" />
      </div>
    </>
  );
};
