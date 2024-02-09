'use client';

import React from 'react';
import {HomeIcon} from '@radix-ui/react-icons';
import Link from 'next/link';
import {DesignerLinks} from './designer-links';
import {EditorHeader} from './editor-header';

type Props = {
  children: React.ReactNode;
};

export const DesignerShell = ({children}: Props) => {
  return (
    <div className="flex">
      <aside className="max-w-[60px] flex-grow border-r">
        <div className="flex h-16 border-b p-2">
          <Link
            href="/"
            className="bg-primary-muted flex h-12 w-12 items-center justify-center rounded-sm"
          >
            <HomeIcon className="h-4 w-4 text-primary" />
          </Link>
        </div>
        <DesignerLinks />
      </aside>
      <main className="flex-1">
        <EditorHeader />
        {children}
      </main>
    </div>
  );
};
