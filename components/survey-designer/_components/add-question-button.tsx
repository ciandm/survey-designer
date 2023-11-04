import React from 'react';
import {Plus} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const AddQuestionButton = ({onClick}: {onClick: () => void}) => {
  return (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onClick}>
            <Plus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add a question</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
