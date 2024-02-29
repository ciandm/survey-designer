'use client';

import {useTransition} from 'react';
import {DotsHorizontalIcon} from '@radix-ui/react-icons';
import {useRouter} from 'next/navigation';
import {useDeleteSurveyDialogTrigger} from '@/components/delete-survey-dialog';
import {useDuplicateSurveyFormTrigger} from '@/components/duplicate-survey-dialog';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {toast} from '@/components/ui/use-toast';
import {getSiteUrl} from '@/lib/hrefs';
import {duplicateSurvey} from '@/survey-dashboard/_actions/survey';
import {
  useSurveyId,
  useSurveySchema,
} from '@/survey-dashboard/_store/survey-designer-store';

export const SurveyActions = () => {
  const schema = useSurveySchema();
  const surveyId = useSurveyId();
  const {handleTriggerDuplicateSurveyDialog} = useDuplicateSurveyFormTrigger();
  const {handleTriggerDeleteSurveyConfirm} = useDeleteSurveyDialogTrigger();
  const router = useRouter();

  const onDeleteSurveySelect = async () => {
    handleTriggerDeleteSurveyConfirm({surveyId}).then(() => {
      router.push(getSiteUrl.homePage());
      router.refresh();
    });
  };

  const onDuplicateSurveySelect = () => {
    handleTriggerDuplicateSurveyDialog({
      initialData: {
        id: surveyId,
        title: schema.title,
        description: schema.description,
      },
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
        <DropdownMenuItem onSelect={onDuplicateSurveySelect}>
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
      router.push(getSiteUrl.designerPage({surveyId: duplicatedSurveyId}));
      router.refresh();
    });
  };

  return {
    handleDuplicateSurvey,
    isDuplicatePending: isPending,
  };
};
