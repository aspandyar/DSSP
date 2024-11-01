import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import { Web3Provider } from "./blockchain/web3";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Web3Provider>
      <App />
    </Web3Provider>
  </React.StrictMode>
);
