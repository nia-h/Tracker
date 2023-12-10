import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <App />,
  //   </React.StrictMode>,  //remove React.StrictMode to avoid double render
);
