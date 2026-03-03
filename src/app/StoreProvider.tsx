"use client";

import React, { useMemo } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/lib/redux/store";

interface StoreProviderProps {
  children: React.ReactNode;
}

let store: AppStore | undefined;

function getStore() {
  if (!store) {
    store = makeStore();
  }
  return store;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  const storeInstance = useMemo(() => getStore(), []);

  return <Provider store={storeInstance}>{children}</Provider>;
}
