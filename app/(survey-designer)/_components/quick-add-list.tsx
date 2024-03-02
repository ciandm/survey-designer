'use client';

import {Button} from '@/components/ui/button';
import {ELEMENT_OPTIONS} from '@/lib/constants/element';
import {useElementCrud} from '@/survey-designer/_hooks/use-element-crud';

export const QuickAddList = () => {
  const {handleCreateElement} = useElementCrud();

  return (
    <ul className="flex h-full flex-col items-stretch gap-2 p-4">
      {ELEMENT_OPTIONS.map((option) => (
        <li key={option.value} className="w-full">
          <Button
            className="flex w-full flex-1 justify-start gap-2"
            variant="outline"
            onClick={() => handleCreateElement({type: option.value})}
          >
            <option.icon />
            <span className="truncate">{option.label}</span>
          </Button>
        </li>
      ))}
    </ul>
  );
};
