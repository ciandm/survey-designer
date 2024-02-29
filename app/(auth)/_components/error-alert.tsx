import React from 'react';
import {XCircleIcon} from '@heroicons/react/20/solid';

type Props = {
  errors: string[];
};

export const ErrorAlert = ({errors}: Props) => {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          {errors?.length > 1 ? (
            <>
              <h3 className="text-sm font-medium text-red-800">
                There were 2 errors with your submission
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul role="list" className="list-disc space-y-1 pl-5">
                  {errors?.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            </>
          ) : (
            <>
              {errors?.map((e, i) => (
                <h3 className="text-sm font-medium text-red-800" key={i}>
                  {e}
                </h3>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
