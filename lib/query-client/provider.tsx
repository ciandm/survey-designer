"use client";

import React, { PropsWithChildren } from "react";
import {
  QueryClient,
  QueryClientProvider as RQClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export const QueryClientProvider = ({ children }: PropsWithChildren) => {
  return <RQClientProvider client={queryClient}>{children}</RQClientProvider>;
};
