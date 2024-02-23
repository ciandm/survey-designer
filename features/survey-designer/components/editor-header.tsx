'use client';

import {useState} from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {HamburgerMenuIcon} from '@radix-ui/react-icons';
import {Loader2, RefreshCw} from 'lucide-react';
import Link from 'next/link';
import {useParams, usePathname, useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {cn} from '@/lib/utils';
import {useManageSurveyPublication} from '../hooks/use-manage-survey-publication';
import {useUpdateSurveySchema} from '../hooks/use-update-survey-schema';
import {
  surveyElementsSelector,
  surveyPublishedSelector,
  surveySchemaSelector,
  useIsSurveyChanged,
  useSurveyDesignerStore,
} from '../store/survey-designer';

const links = [
  {
    label: 'Designer',
    href: '/editor/:id/designer',
  },
  {
    label: 'Preview',
    href: '/editor/:id/preview',
  },
  {
    label: 'Responses',
    href: '/editor/:id/responses',
  },
];

export const EditorHeader = () => {
  const params = useParams();
  const pathname = usePathname();
  const isChanged = useIsSurveyChanged();
  const schema = useSurveyDesignerStore(surveySchemaSelector);
  const {mutate: handleUpdateSurveySchema, isPending: isPendingUpdateSchema} =
    useUpdateSurveySchema();
  const [open, setOpen] = useState(false);

  const onSaveChanges = async () => {
    handleUpdateSurveySchema(
      {...schema},
      {
        onSuccess: () => {
          toast('Survey saved', {
            description: 'Your survey has been saved successfully.',
            action: {
              label: 'View',
              onClick: () => {
                window.open(`/survey/${params.id}`);
              },
            },
          });
        },
      },
    );
  };

  return (
    <DropdownMenu.Root>
      <nav className="flex h-16 w-full flex-shrink-0 items-center justify-between border-b bg-white">
        <DropdownMenu.Trigger asChild className="block md:hidden">
          <Button size="sm" variant="ghost" onClick={() => setOpen(!open)}>
            <HamburgerMenuIcon />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className="mt-4 w-screen bg-card">
            <div className="space-y-1 pb-2">
              {links.map((link) => {
                const href = link.href.replace(':id', params.id as string);
                const isActive = pathname === href;
                return (
                  <Link
                    key={link.href}
                    href={href}
                    className={cn(
                      'flex items-center border-l-4 border-transparent p-2 font-medium text-muted-foreground transition-colors hover:border-muted-foreground',
                      {
                        'border-primary bg-muted text-foreground': isActive,
                      },
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
        <div className="hidden h-full w-full items-center space-x-2 md:flex">
          {links.map((link) => {
            const href = link.href.replace(':id', params.id as string);
            const isActive = pathname === href;
            return (
              <Link
                key={link.href}
                href={href}
                className={cn(
                  'flex h-full items-center border-b-2 border-transparent px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-muted-foreground',
                  {
                    'border-primary text-foreground': isActive,
                  },
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="ml-auto mr-4 flex space-x-4">
          {isChanged && (
            <Button
              size="sm"
              variant="secondary"
              onClick={onSaveChanges}
              disabled={isPendingUpdateSchema}
            >
              Save
              <RefreshCw
                className={cn('ml-2 h-4 w-4 flex-shrink-0', {
                  'animate-spin': isPendingUpdateSchema,
                })}
              />
            </Button>
          )}
          <PublishButton />
        </div>
      </nav>
    </DropdownMenu.Root>
  );
};

const PublishButton = () => {
  const survey = useSurveyDesignerStore(surveySchemaSelector);
  const isPublished = useSurveyDesignerStore(surveyPublishedSelector);
  const {mutateAsync: handleManageSurveyPublication} =
    useManageSurveyPublication();
  const schema = useSurveyDesignerStore(surveySchemaSelector);
  const {mutateAsync: handleUpdateSurveySchema} = useUpdateSurveySchema();
  const isChanged = useIsSurveyChanged();
  const elements = useSurveyDesignerStore(surveyElementsSelector);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);

  const handleOnPublishClick = async () => {
    setIsPublishDialogOpen(true);
    try {
      if (isChanged) {
        await handleUpdateSurveySchema({
          ...schema,
          elements,
        });
      }
      await handleManageSurveyPublication({
        surveyId: survey.id,
        action: isPublished ? 'unpublish' : 'publish',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsPublishDialogOpen(false);
    }
  };

  return (
    <>
      <Button onClick={handleOnPublishClick} size="sm">
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <Dialog open={isPublishDialogOpen}>
        <DialogContent hideCloseButton>
          <DialogHeader>
            <DialogTitle>
              {isPublished ? 'Unpublishing' : 'Publishing'} survey
            </DialogTitle>
            <DialogDescription>This may take a few seconds.</DialogDescription>
          </DialogHeader>
          <Loader2 className="h-8 w-8 animate-spin" />
        </DialogContent>
      </Dialog>
    </>
  );
};
