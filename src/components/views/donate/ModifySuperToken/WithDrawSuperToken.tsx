import { useState, type FC } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { ModifyInfoToast } from './ModifyInfoToast';
import { ModifySection } from './ModifySection';
import { StreamInfo } from './StreamInfo';
import { IModifySuperTokenInnerModalProps } from './ModifySuperTokenModal';
import { ITokenStreams } from '@/context/donate.context';
import { ISuperToken, IToken } from '@/types/superFluid';
import { AddressZero } from '@/lib/constants/constants';

interface IWithDrawSuperTokenProps extends IModifySuperTokenInnerModalProps {
	tokenStreams: ITokenStreams;
	token?: IToken;
	superToken?: ISuperToken;
}

export const WithDrawSuperToken: FC<IWithDrawSuperTokenProps> = ({
	token,
	superToken,
	tokenStreams,
}) => {
	const [amount, setAmount] = useState(0n);
	const { address } = useAccount();

	const {
		data: balance,
		refetch,
		isRefetching,
	} = useBalance({
		token: token?.id === AddressZero ? undefined : token?.id,
		address: address,
	});

	const { data: SuperTokenBalance } = useBalance({
		token: superToken?.id,
		address: address,
	});

	return (
		<>
			<ModifySection
				setAmount={setAmount}
				token={token}
				balance={balance}
				refetch={refetch}
				isRefetching={isRefetching}
			/>
			<StreamInfo
				tokenStreams={tokenStreams}
				superToken={superToken}
				SuperTokenBalance={SuperTokenBalance}
			/>
			<ModifyInfoToast />
		</>
	);
};
