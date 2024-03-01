import React from 'react';
import {getResponses} from '../_lib/get-responses';
import {DeleteResponsesButton} from './delete-responses-button';
import {Response} from './response';

export const Responses = async ({id}: {id: string}) => {
  const surveyResults = await getResponses(id);

  if (surveyResults.length === 0) {
    return <div>No responses found</div>;
  }

  return (
    <div className="w-full flex-1 bg-muted p-8">
      <div className="mx-auto w-full max-w-4xl items-start">
        <DeleteResponsesButton surveyId={id} />
        <div className="mt-4 flex w-full flex-col gap-4">
          {surveyResults.map((surveyResult) => (
            <Response key={id} surveyResult={surveyResult} />
          ))}
        </div>
      </div>
    </div>
  );
};
