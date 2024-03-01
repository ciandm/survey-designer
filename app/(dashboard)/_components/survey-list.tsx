'use client';

import {Prisma} from '@prisma/client';
import {DotsHorizontalIcon} from '@radix-ui/react-icons';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useDeleteSurveyDialogTrigger} from '@/components/delete-survey-dialog';
import {useDuplicateSurveyFormTrigger} from '@/components/duplicate-survey-dialog';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {getSiteUrl} from '@/lib/hrefs';
import {cn} from '@/lib/utils';
import {WithParsedSchema} from '@/lib/validations/survey';

type SurveyWithResult = Prisma.SurveyGetPayload<{
  include: {
    SurveyResult: true;
  };
}>;

type Props = {
  surveys: WithParsedSchema<SurveyWithResult>[];
};

export const SurveyList = ({surveys}: Props) => {
  const {handleTriggerDuplicateSurveyDialog} = useDuplicateSurveyFormTrigger();
  const {handleTriggerDeleteSurveyConfirm} = useDeleteSurveyDialogTrigger();
  const router = useRouter();

  const handleDeleteSurvey = ({id}: {id: string}) => {
    handleTriggerDeleteSurveyConfirm({surveyId: id}).then(() => {
      router.refresh();
    });
  };

  const handleDuplicateSurvey = ({
    title,
    description,
    id,
  }: {
    title: string;
    description?: string;
    id: string;
  }) => {
    const initialData = {
      title: `${title} (copy)`,
      description,
      id,
    };
    handleTriggerDuplicateSurveyDialog({initialData});
  };

  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-md border">
      {surveys.map((survey) => {
        return (
          <DropdownMenu key={survey.id}>
            <div className="flex items-center justify-between bg-card p-4 transition-colors hover:bg-muted">
              <div className="space-y-1">
                <div className="flex gap-2">
                  <div
                    className={cn(
                      'mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-500/10',
                      {'bg-green-500/20': survey.is_published},
                    )}
                  >
                    <div
                      className={cn('h-2 w-2 rounded-full bg-gray-500/75', {
                        'bg-green-500': survey.is_published,
                      })}
                    />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <Button
                      asChild
                      variant="link"
                      className="text-md h-auto p-0 text-foreground"
                    >
                      <Link
                        href={getSiteUrl.designerPage({surveyId: survey.id})}
                      >
                        {survey.schema.title}
                      </Link>
                    </Button>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>{survey.schema.elements.length} questions</span>
                      <span>•</span>
                      <span>{survey.SurveyResult.length} responses</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" className="hidden sm:flex" asChild>
                  <Link href={getSiteUrl.designerPage({surveyId: survey.id})}>
                    Edit
                  </Link>
                </Button>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <DotsHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
              </div>
            </div>
            {/* <CardFooter className="justify-between px-6 py-4">
                <div className="flex w-full flex-col gap-4">
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Responses</p>
                    <p className="text-sm text-muted-foreground">
                      {survey.SurveyResult.length}
                    </p>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">
                      Last updated
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(survey.updatedAt).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>
              </CardFooter> */}
            <DropdownMenuContent className="w-[240px]">
              <DropdownMenuLabel>{survey.schema.title}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={getSiteUrl.designerPage({surveyId: survey.id})}>
                  Edit survey
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={getSiteUrl.previewPage({surveyId: survey.id})}>
                  Preview survey
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={getSiteUrl.responsesPage({surveyId: survey.id})}>
                  View responses
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() =>
                  handleDuplicateSurvey({
                    description: survey.schema.description,
                    title: survey.schema.title,
                    id: survey.id,
                  })
                }
              >
                Make a copy
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleDeleteSurvey({id: survey.id})}
              >
                Delete survey
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </ul>
  );
};
