import React from 'react';

export const EditorSection = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {children}
    </div>
  );
};
