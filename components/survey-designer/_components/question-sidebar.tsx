import React, {useState} from 'react';
import {useAutoAnimate} from '@formkit/auto-animate/react';
import {QuestionType} from '@prisma/client';
import {useIsMutating} from '@tanstack/react-query';
import {Check, FileQuestion, MoreVertical, Plus, Text} from 'lucide-react';
import {
  useSurveySchemaActions,
  useSurveySchemaStore,
} from '@/components/survey-schema-initiailiser';
import {Badge} from '@/components/ui/badge';
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
import {setSelectedFieldId, useSelectedField} from '@/stores/selected-field';

const ICON_MAP: Record<QuestionType, React.ReactNode> = {
  LONG_TEXT: <Text className="h-4 w-4 flex-shrink-0" />,
  SHORT_TEXT: <Text className="h-4 w-4 flex-shrink-0" />,
  MULTIPLE_CHOICE: <Check className="h-4 w-4 flex-shrink-0" />,
  SINGLE_CHOICE: <FileQuestion className="h-4 w-4 flex-shrink-0" />,
};

export const QuestionSidebar = () => {
  const [parent] = useAutoAnimate();
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
      <ul className="flex flex-col" ref={parent}>
        {fields.map((field, index) => (
          <div
            tabIndex={0}
            key={field.id}
            onClick={(e) => {
              if (fixedField) return;
              setSelectedFieldId(field.ref);
            }}
            className={cn(
              'group box-border flex min-h-[56px] cursor-pointer items-center justify-between p-4 text-left',
              {
                'bg-slate-100': field.ref === selectedField?.ref,
              },
            )}
          >
            <li className="mr-4 flex w-full items-center gap-2">
              <Badge className="flex w-full max-w-[56px] flex-shrink-0 justify-between px-2">
                {ICON_MAP[field.type]}
                <span className="text-xs">{index + 1}</span>
              </Badge>
              <div className="line-clamp-2 self-center">
                <p className="text-xs font-medium leading-tight text-gray-500">
                  {field.text || '...'}
                </p>
              </div>
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 flex-shrink-0"
                >
                  <span className="sr-only">Actions</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.stopPropagation();
                    duplicateField({ref: field.ref});
                    setFixedField(null);
                  }}
                >
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.stopPropagation();
                    deleteField({ref: field.ref});
                    setFixedField(null);
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
