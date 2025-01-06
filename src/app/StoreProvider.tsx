'use client';
import { setupListeners } from '@reduxjs/toolkit/query';
import React, { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, type AppStore } from './lib/store';

interface Props {
    readonly children: React.ReactNode;
}

export const StoreProvider = ({ children }: Props): React.ReactElement => {
    const storeRef = useRef<AppStore | null>(null);

    if (storeRef.current === null) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore();
    }

    useEffect(() => {
        if (storeRef.current != null) {
            // configure listeners using the provided defaults
            // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
            setupListeners(storeRef.current.dispatch);
        }
    }, []);

    return <Provider store={storeRef.current}>{children}</Provider>;
};
