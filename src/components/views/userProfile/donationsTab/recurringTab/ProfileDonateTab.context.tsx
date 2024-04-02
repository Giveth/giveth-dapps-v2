import { createContext, FC, ReactNode, useContext } from 'react';
import { ISuperfluidStream } from '@/types/superFluid';
import { useUserStreams } from '@/hooks/useUserStreams';

interface IProfileTabDonateContext {
	tokenStreams: ITokenStreams;
	refetchTokenStream: () => Promise<void>;
}

interface IProviderProps {
	children: ReactNode;
}

const ProfileTabDonateContext = createContext<IProfileTabDonateContext>({
	tokenStreams: {},
	refetchTokenStream: async () => {},
});

ProfileTabDonateContext.displayName = 'ProfileTabDonateContext';

export interface ITokenStreams {
	[key: string]: ISuperfluidStream[];
}

export const ProfileDonateTabProvider: FC<IProviderProps> = ({ children }) => {
	const { refetch: refetchTokenStream, tokenStreams } = useUserStreams();

	return (
		<ProfileTabDonateContext.Provider
			value={{
				tokenStreams,
				refetchTokenStream,
			}}
		>
			{children}
		</ProfileTabDonateContext.Provider>
	);
};

export const useProfileDonateTabData = () => {
	const context = useContext(ProfileTabDonateContext);
	if (context === undefined) {
		throw new Error(
			'useProfileDonateTabData must be used within a Provider',
		);
	}
	return context;
};
