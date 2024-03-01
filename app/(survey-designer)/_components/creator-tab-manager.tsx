'use client';

import React, {useState} from 'react';
import {DesignerTab} from '@/config/designer';
import {createContext} from '@/lib/context';

type CreatorTabManagerProps = {
  tabs: DesignerTab[];
  children: React.ReactNode;
};

export const CreatorTabManager = ({children}: CreatorTabManagerProps) => {
  const [activeTab, setActiveTab] = useState<DesignerTab>('designer');

  return (
    <CreateTabManagerProvider value={{activeTab, setActiveTab}}>
      {children}
    </CreateTabManagerProvider>
  );
};

export const CreatorTabItem = ({
  tab,
  children,
}: {
  tab: DesignerTab;
  children: React.ReactNode;
}) => {
  const {activeTab} = useCreatorTabManager();

  if (activeTab !== tab) {
    return null;
  }

  return <>{children}</>;
};

type Context = {
  activeTab: DesignerTab;
  setActiveTab: (tab: DesignerTab) => void;
};

const [CreateTabManagerProvider, useCreatorTabManager] =
  createContext<Context>();

export {useCreatorTabManager};
