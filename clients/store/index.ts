import { configureStore } from "@reduxjs/toolkit";
import { storeReducers } from "bonmelo.ts";

const store = configureStore({
  reducer: storeReducers,
  devTools: {
    name: 'BonmeloCustomWebStore'
  }
});
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;