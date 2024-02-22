'use client';

import {Button} from '@/components/ui/button';
import {ELEMENT_OPTIONS} from '@/lib/constants/element';
import {useElementCrud} from '../hooks/use-element-crud';

export const BuildPanel = () => {
  const {handleCreateElement} = useElementCrud();

  return (
    <div className="hidden max-w-[240px] flex-1 flex-col gap-2 md:flex">
      <div className="flex flex-col gap-2 p-4">
        {ELEMENT_OPTIONS.map((option) => (
          <Button
            className="flex items-center justify-start gap-2"
            key={option.value}
            variant="secondary"
            onClick={() => handleCreateElement({type: option.value})}
          >
            <option.icon className="h-4 w-4" />
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
