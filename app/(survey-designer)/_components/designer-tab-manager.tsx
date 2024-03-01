'use client';

import React, {useState} from 'react';
import {DesignerTab} from '@/config/designer';
import {createContext} from '@/lib/context';

type DesignerTabManagerProps = {
  tabs: DesignerTab[];
  children: React.ReactNode;
};

export const DesignerTabManager = ({children}: DesignerTabManagerProps) => {
  const [activeTab, setActiveTab] = useState<DesignerTab>('designer');

  return (
    <DesignerTabManagerProvider value={{activeTab, setActiveTab}}>
      {children}
    </DesignerTabManagerProvider>
  );
};

export const DesignerTabItem = ({
  tab,
  children,
}: {
  tab: DesignerTab;
  children: React.ReactNode;
}) => {
  const {activeTab} = useDesignerTabManager();

  if (activeTab !== tab) {
    return null;
  }

  return <>{children}</>;
};

type Context = {
  activeTab: DesignerTab;
  setActiveTab: (tab: DesignerTab) => void;
};

const [DesignerTabManagerProvider, useDesignerTabManager] =
  createContext<Context>();

export {useDesignerTabManager};
