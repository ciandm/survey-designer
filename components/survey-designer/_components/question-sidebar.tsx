import React, {useState} from 'react';
import {useAutoAnimate} from '@formkit/auto-animate/react';
import {QuestionType} from '@prisma/client';
import {useIsMutating} from '@tanstack/react-query';
import {Check, FileQuestion, MoreVertical, Text} from 'lucide-react';
import {
  useActiveQuestion,
  useSurveyFieldActions,
  useSurveyQuestions,
} from '@/components/survey-schema-initiailiser';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {cn} from '@/lib/utils';
import {AddQuestionButton} from './add-question-button';
import {SidebarQuestionItem} from './sidebar-question-item';

export const ICON_MAP: Record<QuestionType, React.ReactNode> = {
  LONG_TEXT: <Text className="h-4 w-4 flex-shrink-0" />,
  SHORT_TEXT: <Text className="h-4 w-4 flex-shrink-0" />,
  MULTIPLE_CHOICE: <Check className="h-4 w-4 flex-shrink-0" />,
  SINGLE_CHOICE: <FileQuestion className="h-4 w-4 flex-shrink-0" />,
};

export const QuestionSidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const questions = useSurveyQuestions();
  const {activeQuestion} = useActiveQuestion();
  const [parent] = useAutoAnimate();
  const isMutating = useIsMutating({
    mutationKey: ['survey-schema'],
  });

  const {
    insertQuestion,
    setActiveQuestionRef,
    deleteQuestion,
    duplicateQuestion,
  } = useSurveyFieldActions();

  return (
    <aside className="flex w-full max-w-[260px] flex-col overflow-hidden border-r">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <h5 className="text-md font-medium tracking-tight">Questions</h5>
        <AddQuestionButton
          onClick={() => insertQuestion({type: 'LONG_TEXT'})}
        />
      </header>
      {!!isMutating && <p>loading...</p>}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <ol className="flex flex-1 flex-col gap-1 p-2" ref={parent}>
          {questions.map((question, index) => (
            <SidebarQuestionItem
              key={question.id}
              question={question}
              index={index}
              isSelected={question.id === activeQuestion?.id}
              type={question.type}
              onClick={() => {
                if (isMenuOpen) return;
                setActiveQuestionRef(question.ref);
              }}
            >
              <DropdownMenu
                modal
                onOpenChange={(checked) => setIsMenuOpen(checked)}
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
                    className="w-8 flex-shrink-0"
                  >
                    <span className="sr-only">Actions</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() => {
                      duplicateQuestion({id: question.id});
                      setIsMenuOpen(false);
                    }}
                  >
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      deleteQuestion({id: question.id});
                      setIsMenuOpen(false);
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
