import {
	configureStore,
	ThunkAction,
	Action,
	combineReducers,
} from '@reduxjs/toolkit';
import modalReducer from './modal/modal.slice';
import userReducer from './user/user.slice';
import priceReducer from './price/price.slice';
import generalReducer from './general/general.slice';
import notificationReducer from './notification/notification.slice';
import pfpReducer from './pfp/pfp.slice';

const rootReducer = combineReducers({
	modal: modalReducer,
	user: userReducer,
	price: priceReducer,
	general: generalReducer,
	notification: notificationReducer,
	pfp: pfpReducer,
});

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
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
