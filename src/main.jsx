import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { Provider } from "react-redux";
import store from "./redux/store.js";
// import { PersistGate } from "redux-persist/integration/react";
// import { store, persistor } from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="420918966550-ugaeijflrille6p1lf876712jivomgh9.apps.googleusercontent.com">
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}>
      </PersistGate> */}
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
