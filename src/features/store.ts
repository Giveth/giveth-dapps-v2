import {
	configureStore,
	ThunkAction,
	Action,
	getDefaultMiddleware,
} from '@reduxjs/toolkit';
// import { subgraphApiSlice } from './subgraph-api-slice';
import priceReducer from './price/price.slice';
import subgraphReducer from './subgraph/subgraph.slice';
import modalReducer from './modal/modal.sclie';
import userReducer from './user/user.slice';
export const store = configureStore({
	reducer: {
		price: priceReducer,
		subgraph: subgraphReducer,
		modal: modalReducer,
		user: userReducer,
	},
	// NOTE: This is the only way I could find to avoid the serialized warning/error for BigNumbers
	// If you guys have a better solution please let me know :)
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					'price/setGivPrice',
					'price/setEthPrice',
					'price/setXDaiThirdPartTokensPrice',
					'price/getTokenPrice',
					'price/getTokenPrice/fulfilled',
				],
				ignoredPaths: ['price'],
			},
		}),
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
