import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";
import App from "./App";
import { CarritoProvider } from "./context/CarritoContext";
import "./index.css";

const base = import.meta.env.BASE_URL;
const cliente = new ApolloClient({
  link: new HttpLink({ uri: `${base}graphql` }),
  cache: new InMemoryCache(),
});

async function iniciarAplicacion() {
  // Iniciamos msw antes de montar React para evitar solicitudes sin interceptar
  const { worker } = await import("./mocks/browser");
  await worker.start({
    serviceWorker: {
      url: `${base}mockServiceWorker.js`,
      options: { scope: base },
    },
    onUnhandledRequest: "bypass",
    quiet: true,
  });
  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <ApolloProvider client={cliente}>
        <HashRouter>
          <CarritoProvider>
            <App />
          </CarritoProvider>
        </HashRouter>
      </ApolloProvider>
    </React.StrictMode>,
  );
}

iniciarAplicacion().catch((error) => {
  console.error("No se pudo iniciar el backend", error);
  document.getElementById("root").textContent =
    "No se pudo iniciar la aplicación.";
});
