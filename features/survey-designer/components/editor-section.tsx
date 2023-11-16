import React from 'react';

export const EditorSection = ({children}: {children: React.ReactNode}) => {
  return (
    <section className="flex h-full flex-1 flex-col overflow-hidden">
      {children}
    </section>
  );
};
