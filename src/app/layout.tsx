"use client";

// app/layout.tsx
import "./globals.css";
import ClientTransition from "./ClientTransition";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <ClientTransition>
                {children}
                <ToastContainer position="bottom-right" autoClose={3000} />
              </ClientTransition>
            </QueryClientProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
