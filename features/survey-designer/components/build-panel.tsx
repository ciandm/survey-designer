'use client';

import {
  HamburgerMenuIcon,
  Pencil1Icon,
  Pencil2Icon,
} from '@radix-ui/react-icons';
import {Button} from '@/components/ui/button';
import {QUESTION_TYPE} from '@/lib/constants/question';
import {useQuestionCrud} from '../hooks/use-question-crud';

const options = [
  {
    label: 'Multiple Choice',
    value: QUESTION_TYPE.multiple_choice,
    icon: HamburgerMenuIcon,
  },
  {label: 'Short text', value: QUESTION_TYPE.short_text, icon: Pencil1Icon},
  {label: 'Long text', value: QUESTION_TYPE.long_text, icon: Pencil2Icon},
];

export const BuildPanel = () => {
  const {handleCreateQuestion} = useQuestionCrud();
  return (
    <div className="flex max-w-xs flex-1 flex-col gap-2 border-r bg-card">
      <div className="border-b px-2 py-3">
        <h4>Build</h4>
      </div>
      <div className="flex flex-col gap-2 px-2 pb-2">
        {options.map((option) => (
          <Button
            className="flex items-center justify-start gap-2"
            key={option.value}
            variant="outline"
            onClick={() => handleCreateQuestion({type: option.value})}
          >
            <option.icon className="h-4 w-4" />
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
