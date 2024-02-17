import {useState} from 'react';
import {ChevronDownIcon} from '@radix-ui/react-icons';
import {Check} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Separator} from '@/components/ui/separator';
import {QUESTION_OPTIONS, QuestionType} from '@/lib/constants/question';
import {cn} from '@/lib/utils';
import {useQuestionCrud} from '../hooks/use-question-crud';

type AddQuestionProps = {
  className?: string;
};

export const AddQuestion = ({className}: AddQuestionProps) => {
  const {handleCreateQuestion} = useQuestionCrud();
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <div className="flex">
      <Button
        variant="outline"
        className={cn('rounded-r-none border-r-0', className)}
        onClick={() => handleCreateQuestion()}
      >
        Add question
      </Button>
      <Separator orientation="vertical" />
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="rounded-l-none border-l-0">
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Type to search..." />
            <CommandEmpty>Nothing to display.</CommandEmpty>
            <CommandGroup>
              {QUESTION_OPTIONS.map((option) => (
                <CommandItem
                  className="p-3"
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    handleCreateQuestion({type: currentValue as QuestionType});
                    setPopoverOpen(false);
                  }}
                >
                  <option.icon className="mr-2 h-4 w-4" />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
