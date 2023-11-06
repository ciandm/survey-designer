import {Plus} from 'lucide-react';
import {Button} from '@/components/ui/button';

export const AddQuestionButton = ({onClick}: {onClick: () => void}) => {
  return (
    <Button variant="ghost" onClick={onClick}>
      <Plus className="mr-2 h-4 w-4" />
      New Question
    </Button>
  );
};
