import {useState} from 'react';
import {
  CopyIcon,
  DotsHorizontalIcon,
  TrashIcon,
  UploadIcon,
} from '@radix-ui/react-icons';
import {Label} from '@radix-ui/react-label';
import {Switch} from '@radix-ui/react-switch';
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {AlertDialogCancel} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {toast} from '@/components/ui/use-toast';
import {useDeleteSurvey} from '../hooks/use-delete-survey';
import {useDuplicateSurvey} from '../hooks/use-duplicate-survey';
import {useSurveyDetails} from '../store/survey-designer';
import {DeleteSurveyAlert} from './delete-survey-alert';

export const SurveyActions = () => {
  const {id} = useSurveyDetails();
  const [open, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const {mutate: duplicateSurvey, isPending: isPendingDuplicate} =
    useDuplicateSurvey();
  const {mutate: deleteSurvey, isPending: isPendingDelete} = useDeleteSurvey();

  const handleDeleteSurvey = () => {
    deleteSurvey(
      {surveyId: id},
      {
        onSuccess: () => {
          setShowDeleteDialog(false);
          router.push('/');
          router.refresh();
        },
      },
    );
  };

  const handleDuplicateSurvey = () => {
    duplicateSurvey(
      {surveyId: id},
      {
        onSuccess: ({survey: duplicatedSurvey}) => {
          toast({
            title: 'Survey duplicated',
            description: 'Your survey has been duplicated successfully.',
            variant: 'default',
          });
          let query = '';
          if (duplicatedSurvey.schema.questions.length > 0) {
            query = `?question=${duplicatedSurvey.schema.questions[0].ref}`;
          }
          router.push(`/editor/${duplicatedSurvey.id}${query}`);
          router.refresh();
        },
      },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <span className="sr-only">Actions</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={handleDuplicateSurvey}
            disabled={isPendingDuplicate}
          >
            Duplicate
            <CopyIcon className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
            disabled={isPendingDuplicate}
          >
            Delete
            <TrashIcon className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Content filter preferences</DialogTitle>
            <DialogDescription>
              The content filter flags text that may violate our content policy.
              It&apos;s powered by our moderation endpoint which is free to use
              to moderate your OpenAI API traffic. Learn more.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <h4 className="text-sm text-muted-foreground">
              Playground Warnings
            </h4>
            <div className="flex items-start justify-between space-x-4 pt-3">
              <Switch name="show" id="show" defaultChecked={true} />
              <Label className="grid gap-1 font-normal" htmlFor="show">
                <span className="font-semibold">
                  Show a warning when content is flagged
                </span>
                <span className="text-sm text-muted-foreground">
                  A warning will be shown when sexual, hateful, violent or
                  self-harm content is detected.
                </span>
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteSurveyAlert
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <AlertDialogCancel disabled={isPendingDelete}>Cancel</AlertDialogCancel>
        <Button
          disabled={isPendingDelete}
          variant="destructive"
          onClick={handleDeleteSurvey}
        >
          Delete
          {isPendingDelete && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </DeleteSurveyAlert>
    </>
  );
};
