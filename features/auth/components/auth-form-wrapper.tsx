import React from 'react';

type Props = {
  children: React.ReactNode;
};

export const AuthFormWrapper = ({children}: Props) => {
  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center bg-muted py-12 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

AuthFormWrapper.Title = function Title({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        {children}
      </h2>
    </div>
  );
};

AuthFormWrapper.Form = function Form({children}: {children: React.ReactNode}) {
  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
        {children}
      </div>
    </div>
  );
};

AuthFormWrapper.AlternateCta = function AlternateCta({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="mt-10 text-center text-sm text-gray-500">{children}</p>;
};
