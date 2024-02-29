'use client';

import {DotsHorizontalIcon} from '@radix-ui/react-icons';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useDeleteSurveyConfirm} from '@/components/delete-survey-dialog';
import {Button} from '@/components/ui/button';
import {Card, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Separator} from '@/components/ui/separator';
import {getSiteUrl} from '@/lib/hrefs';
import {cn} from '@/lib/utils';
import {SurveyResponse, SurveySchema} from '@/lib/validations/survey';

type SurveyCardProps = {
  schema: SurveySchema;
  survey: SurveyResponse['survey'];
  responsesCount: number;
};

export const SurveyCard = ({
  schema,
  survey,
  responsesCount,
}: SurveyCardProps) => {
  const onConfirmDelete = useDeleteSurveyConfirm();
  const router = useRouter();

  const onDelete = () => {
    onConfirmDelete({surveyId: survey.id}).then(() => {
      router.refresh();
    });
  };

  return (
    <DropdownMenu key={survey.id}>
      <Card className="p-0">
        <CardHeader className="bg-muted p-6">
          <div className="flex items-center justify-between">
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
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-base">{schema.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {survey.is_published ? 'Published' : 'Draft'}
                  </p>
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
        </CardHeader>
        <CardFooter className="justify-between px-6 py-4">
          <div className="flex w-full flex-col gap-4">
            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">Responses</p>
              <p className="text-sm text-muted-foreground">{responsesCount}</p>
            </div>
            <Separator />
            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">Last updated</p>
              <p className="text-sm text-muted-foreground">
                {new Date(survey.updatedAt).toLocaleDateString('en-GB')}
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
      <DropdownMenuContent className="w-[240px]">
        <DropdownMenuLabel>{schema.title}</DropdownMenuLabel>
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
        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem onSelect={onDelete}>Delete survey</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
