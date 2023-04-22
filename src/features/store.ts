import {
	configureStore,
	ThunkAction,
	Action,
	PreloadedState,
	combineReducers,
} from '@reduxjs/toolkit';
import subgraphReducer from './subgraph/subgraph.slice';
import modalReducer from './modal/modal.slice';
import userReducer from './user/user.slice';
import priceReducer from './price/price.slice';
import generalReducer from './general/general.slice';
import notificationReducer from './notification/notification.slice';
import pfpReducer from './pfp/pfp.slice';

const rootReducer = combineReducers({
	subgraph: subgraphReducer,
	modal: modalReducer,
	user: userReducer,
	price: priceReducer,
	general: generalReducer,
	notification: notificationReducer,
	pfp: pfpReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
	return configureStore({
		reducer: rootReducer,
		preloadedState,
	});
};

export const store = setupStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
