import {createSafeActionClient} from 'next-safe-action';

export class ActionError extends Error {}

const handleReturnedServerError = (e: Error) => {
  // If the error is an instance of `ActionError`, unmask the message.
  if (e instanceof ActionError) {
    return e.message;
  }

  // Otherwise return default error message.
  return 'Something went wrong. Please try again.';
};

export const action = createSafeActionClient({
  handleReturnedServerError,
});
