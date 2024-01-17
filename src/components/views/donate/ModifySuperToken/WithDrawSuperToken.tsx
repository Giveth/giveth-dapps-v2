import { useState, type FC } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { Button } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { ModifyInfoToast } from './ModifyInfoToast';
import { ModifySection } from './ModifySection';
import { StreamInfo } from './StreamInfo';
import { IModifySuperTokenInnerModalProps } from './ModifySuperTokenModal';
import { ITokenStreams } from '@/context/donate.context';
import { ISuperToken, IToken } from '@/types/superFluid';
import { AddressZero } from '@/lib/constants/constants';
import { actionButtonLabel, EModifySuperTokenSteps } from './common';

interface IWithDrawSuperTokenProps extends IModifySuperTokenInnerModalProps {
	tokenStreams: ITokenStreams;
	token?: IToken;
	superToken?: ISuperToken;
}

export const WithDrawSuperToken: FC<IWithDrawSuperTokenProps> = ({
	token,
	superToken,
	tokenStreams,
	step,
	setStep,
}) => {
	const [amount, setAmount] = useState(0n);
	const { address } = useAccount();
	const { formatMessage } = useIntl();

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

	const onAction = async () => {};

	return (
		<>
			<ModifySection
				setAmount={setAmount}
				token={superToken}
				balance={SuperTokenBalance}
				refetch={refetch}
				isRefetching={isRefetching}
			/>
			<StreamInfo
				tokenStreams={tokenStreams}
				superToken={superToken}
				SuperTokenBalance={SuperTokenBalance}
			/>
			<ModifyInfoToast />
			<Button
				label={formatMessage({ id: actionButtonLabel[step] })}
				disabled={
					step === EModifySuperTokenSteps.MODIFY &&
					(amount <= 0 ||
						balance === undefined ||
						amount > balance.value)
				}
				loading={step === EModifySuperTokenSteps.WITHDRAWING}
				onClick={onAction}
			/>
		</>
	);
};
