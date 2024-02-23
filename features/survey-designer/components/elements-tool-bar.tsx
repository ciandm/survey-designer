'use client';

import {Button} from '@/components/ui/button';
import {ELEMENT_OPTIONS, ElementType} from '@/lib/constants/element';
import {useElementCrud} from '../hooks/use-element-crud';

export const ElementsToolbar = () => {
  const {handleCreateElement} = useElementCrud();

  return (
    <div className="flex flex-col gap-2 p-4">
      {ELEMENT_OPTIONS.map((option) => (
        <Button
          key={option.value}
          className="flex items-center justify-start gap-2"
          variant="outline"
          onClick={() => handleCreateElement({type: option.value})}
        >
          <option.icon />
          {option.label}
        </Button>
      ))}
    </div>
  );
};
