import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// import { subgraphApiSlice } from './subgraph-api-slice';
import subgraphReducer from './subgraph/subgraph.slice';
import modalReducer from './modal/modal.slice';
import userReducer from './user/user.slice';
import priceReducer from './price/price.slice';
import generalReducer from './general/general.slice';

export const store = configureStore({
	reducer: {
		subgraph: subgraphReducer,
		modal: modalReducer,
		user: userReducer,
		price: priceReducer,
		general: generalReducer,
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
