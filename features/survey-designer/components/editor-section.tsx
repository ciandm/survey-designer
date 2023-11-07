import React from 'react';

export const EditorSection = ({children}: {children: React.ReactNode}) => {
  return (
    <section className="flex w-full flex-col overflow-hidden">
      {children}
    </section>
  );
};
