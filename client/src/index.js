import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import {
  CurrentUserContext,
  CurrentUserProvider,
} from "./components/UserContext";

ReactDOM.render(
  <React.StrictMode>
    <CurrentUserProvider>
      <App />
    </CurrentUserProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
