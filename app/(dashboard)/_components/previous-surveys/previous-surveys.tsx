import {Skeleton} from '@/components/ui/skeleton';
import {getUserSurveys} from '@/dashboard/_lib/get-user-surveys';
import {PreviousSurveyClickable} from './previous-survey-clickable';

export const PreviousSurveys = async () => {
  const surveys = await getUserSurveys();

  return (
    <ul className="flex flex-col rounded-lg border bg-card">
      {surveys.map((survey) => (
        <PreviousSurveyClickable key={survey.id} survey={survey}>
          <div className="flex-1">
            <h3 className="text-sm font-medium">{survey.model.title}</h3>
            <div className="mt-1 flex gap-2">
              <div className="flex gap-1 text-xs text-muted-foreground">
                <span>
                  Created: {new Date(survey.createdAt).toLocaleDateString()}
                </span>
                <span>|</span>
                <span>
                  Modified: {new Date(survey.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex w-full justify-between gap-0.5 text-left sm:mt-0 sm:w-auto sm:flex-grow-0 sm:flex-col sm:text-right">
            <p className="text-sm">{survey.SurveyResult.length} responses</p>
            <p className="text-sm text-muted-foreground">
              {survey.model.fields.length + ' questions'}
            </p>
          </div>
        </PreviousSurveyClickable>
      ))}
    </ul>
  );
};

PreviousSurveys.Skeleton = function PreviousSurveysSkeleton() {
  return (
    <ul className="flex flex-col rounded-lg border bg-card">
      {...Array.from({length: 3}).map((_, i) => (
        <li key={i} className="flex flex-col px-5 py-8 sm:flex-row">
          <div className="flex-1">
            <Skeleton className="h-4 w-1/2" />
            <div className="mt-1 flex gap-2">
              <div className="flex gap-1 text-xs text-muted-foreground">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
          <div className="mt-4 flex w-full justify-between gap-0.5 sm:mt-0 sm:w-auto sm:flex-grow-0 sm:flex-col sm:items-end">
            <Skeleton className="h-3 w-16 sm:w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </li>
      ))}
    </ul>
  );
};
