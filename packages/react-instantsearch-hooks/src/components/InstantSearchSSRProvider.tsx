import React from 'react';

import { InstantSearchSSRContext } from '../lib/InstantSearchSSRContext';

import type { InitialResults, InstantSearch, UiState } from 'instantsearch.js';
import type { ReactNode } from 'react';

export type InstantSearchServerState = {
  initialResults: InitialResults;
};

export type InstantSearchSSRProviderProps =
  Partial<InstantSearchServerState> & {
    children?: ReactNode;
  };

/**
 * Provider to pass the server state retrieved from `getServerState()` to
 * <InstantSearch>.
 */
export function InstantSearchSSRProvider<
  TUiState extends UiState,
  TRouteState = TUiState
>({ children, ...props }: InstantSearchSSRProviderProps) {
  // This is used in `useInstantSearchApi()` to avoid creating and starting multiple instances of
  // `InstantSearch` on mount.
  const ssrSearchRef = React.useRef<InstantSearch<UiState, TRouteState> | null>(
    null
  );

  // When <DynamicWidgets> is mounted, a second provider is used above the user-land
  // <InstantSearchSSRProvider> in `getServerState()`.
  // To avoid the user's provider overriding the context value with an empty object,
  // we skip this provider.
  if (Object.keys(props).length === 0) {
    return <>{children}</>;
  }

  return (
    <InstantSearchSSRContext.Provider value={{ ...props, ssrSearchRef }}>
      {children}
    </InstantSearchSSRContext.Provider>
  );
}