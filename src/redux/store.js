import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import rootReducer from "./rootReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist auth slice
};

// const persistedReducer = persistReducer(persistConfig, {
//   auth: authReducer,
//   users: userReducer,
//   employer: employerReducer,
//   jobSeeker: jobSeekerReducer,
// });
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);


// // frontend/src/app/store.js

// import { configureStore } from "@reduxjs/toolkit";
// // import authReducer from "../features/auth/authSlice";
// // import authReducer from "./slice/auth/authSlice.js";
// import rootReducer from "./rootReducer";

// const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
// });

// export default store;
