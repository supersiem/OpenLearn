"use client";
import React, { useRef } from 'react';
import { createListStore, ListStoreContext, type List } from './listStore';

export function ListStoreProvider({
  children,
  initialData
}: {
  children: React.ReactNode;
  initialData?: { list?: List; method?: string; flipQuestionLang?: boolean }
}) {
  // Only create the store once per provider instance
  const storeRef = useRef(createListStore(initialData));

  return (
    <ListStoreContext.Provider value={storeRef.current}>
      {children}
    </ListStoreContext.Provider>
  );
}