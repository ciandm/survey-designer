import React from 'react';
import {db} from '@/lib/db/survey';
import {DuplicatePreviousPopup} from './duplicate-previous-popup';
import {PreviousSurveyContainer} from './previous-survey-container';

export const PreviousSurveys = async () => {
  const surveys = await db.getSurveysWithResponses();

  return (
    <DuplicatePreviousPopup>
      <div className="flex flex-col rounded-lg border bg-card">
        {surveys.map((survey) => (
          <PreviousSurveyContainer key={survey.id} survey={survey}>
            <div className="flex-1">
              <h3 className="text-sm font-medium">{survey.schema.title}</h3>
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
                {survey.schema.elements.length + ' questions'}
              </p>
            </div>
          </PreviousSurveyContainer>
        ))}
      </div>
    </DuplicatePreviousPopup>
  );
};
