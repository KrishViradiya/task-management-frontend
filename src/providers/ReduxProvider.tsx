// frontend/src/providers/ReduxProvider.tsx
"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";
import SocketInitializer from "../components/SocketInitializer";

interface ReduxProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketInitializer />
        {children}
      </PersistGate>
    </Provider>
  );
}
