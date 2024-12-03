import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import { IUser } from '@/apollo/types/types';
import { getGIVpowerBalanceByAddress } from '@/services/givpower';

interface ProfileContext {
	user: IUser;
	myAccount: boolean;
	givpowerBalance: string;
	updateUser: (updatedUser: Partial<IUser>) => void;
}

const ProfileContext = createContext<ProfileContext>({
	user: {} as IUser,
	myAccount: false,
	givpowerBalance: '0',
	updateUser: () => {},
});

ProfileContext.displayName = 'ProfileContext';

export const ProfileProvider = (props: {
	user: IUser;
	myAccount: boolean;
	children: ReactNode;
}) => {
	const { user: initialUser, myAccount, children } = props;
	const [user, setUser] = useState<IUser>(initialUser);
	const [balance, setBalance] = useState('0');

	// Update user data
	const updateUser = (updatedUser: Partial<IUser>) => {
		setUser(prevUser => ({
			...prevUser,
			...updatedUser,
		}));
	};

	useEffect(() => {
		const fetchTotal = async () => {
			try {
				const res = await getGIVpowerBalanceByAddress([
					user?.walletAddress!,
				]);
				setBalance(res[user?.walletAddress!]);
			} catch (error) {
				console.error('error on getGIVpowerBalanceByAddress', {
					error,
				});
			}
		};
		if (!myAccount) fetchTotal();
	}, [myAccount, user]);

	return (
		<ProfileContext.Provider
			value={{
				user,
				myAccount,
				givpowerBalance: balance,
				updateUser,
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
