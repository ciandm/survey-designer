'use client';

import {useTransition} from 'react';
import {DotsHorizontalIcon} from '@radix-ui/react-icons';
import {useRouter} from 'next/navigation';
import {useDeleteSurveyConfirm} from '@/components/delete-survey';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {toast} from '@/components/ui/use-toast';
import {siteUrls} from '@/lib/hrefs';
import {duplicateSurvey} from '../actions/survey';
import {useSurveyId} from '../store/survey-designer-store';

export const SurveyActions = () => {
  const surveyId = useSurveyId();
  const {handleDuplicateSurvey, isDuplicatePending} = useDuplicateSurvey();
  const onConfirmDelete = useDeleteSurveyConfirm();
  const router = useRouter();

  const onDeleteSurveySelect = async () => {
    onConfirmDelete({surveyId}).then(() => {
      router.push('/');
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm">
          <span className="sr-only">Actions</span>
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        <DropdownMenuItem
          onSelect={() => handleDuplicateSurvey(surveyId)}
          disabled={isDuplicatePending}
        >
          Duplicate survey
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600"
          onSelect={onDeleteSurveySelect}
        >
          Delete survey
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const useDuplicateSurvey = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDuplicateSurvey = (surveyId: string) => {
    startTransition(async () => {
      const {surveyId: duplicatedSurveyId} = await duplicateSurvey(surveyId);
      toast({
        title: 'Survey duplicated',
        description: 'Your survey has been duplicated successfully.',
        variant: 'default',
      });
      router.push(siteUrls.designerPage({surveyId: duplicatedSurveyId}));
      router.refresh();
    });
  };

  return {
    handleDuplicateSurvey,
    isDuplicatePending: isPending,
  };
};
