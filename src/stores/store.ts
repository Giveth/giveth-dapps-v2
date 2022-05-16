import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// import { subgraphApiSlice } from './subgraph-api-slice';
import subgraphReducer from './subgraph.store';

export const store = configureStore({
	reducer: {
		subgraph: subgraphReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
