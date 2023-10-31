import React, {useState} from 'react';
import {useIsMutating} from '@tanstack/react-query';
import {MoreVertical, Plus} from 'lucide-react';
import {
  useSurveySchemaActions,
  useSurveySchemaStore,
} from '@/components/survey-schema-initiailiser';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {cn} from '@/lib/utils';
import {setSelectedFieldId, useSelectedField} from '@/stores/selected-field.ts';

export const QuestionSidebar = () => {
  const fields = useSurveySchemaStore((state) => state.fields);
  const {insertField, deleteField, duplicateField} = useSurveySchemaActions();
  const selectedField = useSelectedField();

  const isMutating = useIsMutating({
    mutationKey: ['survey-schema'],
  });

  const selectedFieldIndex = fields.findIndex(
    (q) => q.ref === selectedField?.ref,
  );

  const [fixedField, setFixedField] = useState<string | null>(null);

  return (
    <aside className="w-full max-w-[260px] border-r">
      <header className="flex items-center justify-between border-b p-4">
        <h5 className="text-md font-semibold tracking-tight">Fields</h5>
        <TooltipProvider delayDuration={400}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  insertField({
                    type: 'SHORT_TEXT',
                    indexAt: selectedFieldIndex + 1,
                  })
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add a question</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </header>
      {!!isMutating && <p>loading...</p>}
      <ul className="flex flex-col">
        {fields.map((field) => (
          <div
            tabIndex={0}
            key={field.id}
            onClick={(e) => {
              if (fixedField) return;
              setSelectedFieldId(field.ref);
            }}
            className={cn(
              'group flex cursor-pointer justify-between p-3 text-left',
              {
                'bg-slate-100': field.ref === selectedField?.ref,
              },
            )}
          >
            <li>
              <div>{field.type}</div>
              <div>{field.text}</div>
            </li>

            <DropdownMenu
              onOpenChange={(open) => setFixedField(open ? field.ref : null)}
            >
              <DropdownMenuTrigger
                asChild
                className={cn(
                  'invisible opacity-0 transition-opacity group-hover:visible group-hover:opacity-100',
                  {
                    'visible opacity-100': fixedField === field.ref,
                  },
                )}
              >
                <Button variant="ghost" size="icon">
                  <span className="sr-only">Actions</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.stopPropagation();
                    duplicateField({ref: field.ref});
                  }}
                >
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.stopPropagation();
                    deleteField({ref: field.ref});
                  }}
                  className="text-red-600"
                >
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </ul>
    </aside>
  );
};
