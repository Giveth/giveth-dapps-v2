import { createContext, ReactNode, useContext } from 'react';
import { IUser } from '@/apollo/types/types';

interface ProfileContext {
	user: IUser;
	myAccount?: boolean;
}

const ProfileContext = createContext<ProfileContext>({
	user: {} as IUser,
	myAccount: false,
});

ProfileContext.displayName = 'ProfileContext';

export const ProfileProvider = (props: {
	user: IUser;
	myAccount: boolean;
	children: ReactNode;
}) => {
	const { user, children } = props;

	return (
		<ProfileContext.Provider
			value={{
				user,
			}}
		>
			{children}
		</ProfileContext.Provider>
	);
};

export function useProfileContext() {
	const context = useContext(ProfileContext);

	if (!context) {
		throw new Error('Profile context not found!');
	}

	return context;
}
