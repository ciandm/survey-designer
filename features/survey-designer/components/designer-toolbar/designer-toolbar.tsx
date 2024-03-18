'use client';

import {useState} from 'react';
import {Edit, Loader2} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {SurveyDialog} from '@/components/survey-dialog';
import {Button} from '@/components/ui';
import {DesignerNavigation} from '@/features/survey-designer/components/designer-navigation';
import {useEditSurveyForm} from '@/features/survey-designer/components/designer-toolbar/use-edit-survey-form';
import {
  useDesignerStoreActions,
  useDesignerStoreSurvey,
} from '@/features/survey-designer/store/designer-store';
import {TabConfig} from '@/types/tab';

type DesignerToolbarProps = {
  tabs: TabConfig[];
  homeHref: string;
  title?: string;
  children?: React.ReactNode;
};

export const DesignerToolbar = ({
  tabs,
  homeHref,
  title = 'Survey editor',
  children,
}: DesignerToolbarProps) => {
  const [isSurveyDialogOpen, setIsSurveyDialogOpen] = useState(false);

  const {title: surveyTitle, description, id} = useDesignerStoreSurvey();
  const storeActions = useDesignerStoreActions();

  const router = useRouter();

  const {form, onSubmit, editStatus} = useEditSurveyForm({
    initialData: {title: surveyTitle, description},
    id,
    onSuccess: ({title, description = ''}) => {
      storeActions.survey.updateTitle(title);
      storeActions.survey.updateDescription(description);
      setIsSurveyDialogOpen(false);
      toast('Changes saved 🎉', {
        description: 'Your changes have been saved successfully.',
      });
      router.refresh();
    },
  });

  const handleCancel = () => {
    setIsSurveyDialogOpen(false);
    form.reset({title: surveyTitle, description});
  };

  const handleOpenChange = (isOpen: boolean) => {
    setIsSurveyDialogOpen(isOpen);
    form.reset({title: surveyTitle, description});
  };

  return (
    <>
      <header className="sticky top-0 z-10 flex flex-col border-b bg-blue-950 md:py-0">
        <div className="flex min-h-[3.5rem] flex-1 items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2 overflow-hidden text-sm font-medium text-white">
            <Link href={homeHref} className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <div className="group flex items-center gap-2">
              <span className="truncate font-semibold">
                {surveyTitle ?? title}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="hidden h-8 w-8 group-hover:flex"
                onClick={() => setIsSurveyDialogOpen(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {children}
        </div>
        <DesignerNavigation tabs={tabs} />
      </header>
      <SurveyDialog
        isOpen={isSurveyDialogOpen}
        onOpenChange={handleOpenChange}
        form={form}
        onSubmit={onSubmit}
        actions={
          <div className="ml-auto mt-8 flex gap-2">
            <Button
              disabled={editStatus === 'executing'}
              type="button"
              onClick={handleCancel}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={editStatus === 'executing' || !form.formState.isDirty}
            >
              {editStatus === 'executing' && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </div>
        }
      />
    </>
  );
};
