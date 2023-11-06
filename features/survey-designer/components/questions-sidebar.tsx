'use client';

import React, {useState} from 'react';
import {QuestionType} from '@prisma/client';
import {Check, FileQuestion, MoreVertical, Plus, Text} from 'lucide-react';
import {
  useActiveQuestion,
  useSurveyFieldActions,
  useSurveyQuestions,
} from '@/stores/survey-schema';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {cn} from '@/lib/utils';
import {SidebarQuestionItem} from './sidebar-question-item';

export const ICON_MAP: Record<QuestionType, React.ReactNode> = {
  LONG_TEXT: <Text className="h-4 w-4 flex-shrink-0" />,
  SHORT_TEXT: <Text className="h-4 w-4 flex-shrink-0" />,
  MULTIPLE_CHOICE: <Check className="h-4 w-4 flex-shrink-0" />,
  SINGLE_CHOICE: <FileQuestion className="h-4 w-4 flex-shrink-0" />,
};

export const QuestionsSidebar = () => {
  const [menuStatus, setMenuStatus] = useState<'open' | 'closed'>('closed');
  const questions = useSurveyQuestions();
  const {activeQuestion} = useActiveQuestion();

  const {
    insertQuestion,
    setActiveQuestionRef,
    deleteQuestion,
    duplicateQuestion,
  } = useSurveyFieldActions();

  return (
    <aside className="flex w-full max-w-[260px] flex-col overflow-hidden border-r">
      <Button
        variant="ghost"
        className="mt-4 rounded-none"
        onClick={() => insertQuestion({type: 'SHORT_TEXT'})}
      >
        <Plus className="mr-2 h-4 w-4" />
        New Question
      </Button>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <ol className="mt-4 flex flex-1 flex-col">
          {questions.map((question, index) => (
            <SidebarQuestionItem
              key={question.id}
              question={question}
              index={index}
              isSelected={question.id === activeQuestion?.id}
              type={question.type}
              onClick={() => {
                if (menuStatus === 'open') return;
                setActiveQuestionRef(question.ref);
              }}
            >
              <DropdownMenu
                modal
                onOpenChange={(checked) =>
                  setMenuStatus(checked ? 'open' : 'closed')
                }
              >
                <DropdownMenuTrigger
                  asChild
                  className={cn(
                    'invisible opacity-0 transition-opacity group-hover:visible group-hover:opacity-100',
                  )}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 flex-shrink-0 hover:bg-transparent"
                  >
                    <span className="sr-only">Actions</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() => {
                      duplicateQuestion({id: question.id});
                      setMenuStatus('closed');
                    }}
                  >
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      deleteQuestion({id: question.id});
                      setMenuStatus('closed');
                    }}
                    className="text-red-600"
                  >
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarQuestionItem>
          ))}
        </ol>
      </div>
    </aside>
  );
};
