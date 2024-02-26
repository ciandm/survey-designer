'use client';

import {DotsHorizontalIcon} from '@radix-ui/react-icons';
import Link from 'next/link';
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
  return (
    <DropdownMenu key={survey.id}>
      <Card className="p-0">
        <CardHeader className="bg-muted p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded-full bg-muted',
                    {'bg-green-500/20': survey.is_published},
                  )}
                >
                  <div
                    className={cn('h-2 w-2 rounded-full bg-muted-foreground', {
                      'bg-green-500': survey.is_published,
                    })}
                  />
                </div>
                <CardTitle className="text-base">{schema.title}</CardTitle>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="hidden sm:flex" asChild>
                <Link href={`/editor/${survey.id}/designer`}>Edit</Link>
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
        <DropdownMenuItem>Edit survey</DropdownMenuItem>
        <DropdownMenuItem>Preview survey</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Delete survey</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
