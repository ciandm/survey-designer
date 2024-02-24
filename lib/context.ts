import * as React from 'react';

export function createContext<T>() {
  const ctx = React.createContext<T | undefined>(undefined);

  function useContext() {
    const c = React.useContext(ctx);

    if (!c) {
      throw new Error('useContext must be inside a Provider with a value');
    }
    return c;
  }

  return [ctx.Provider, useContext] as const;
}
