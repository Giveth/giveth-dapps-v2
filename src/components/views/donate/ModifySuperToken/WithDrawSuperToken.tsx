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
import { actionButtonLabel, EModifySuperTokenSteps } from './common';
import { ModifyWrapper, Wrapper } from './common.sc';

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
		data: SuperTokenBalance,
		refetch,
		isRefetching,
	} = useBalance({
		token: superToken?.id,
		address: address,
	});

	const tokenStream = tokenStreams[superToken?.id || ''];
	const totalStreamPerSec =
		tokenStream?.reduce(
			(acc, stream) => acc + BigInt(stream.currentFlowRate),
			0n,
		) || 0n;
	const minRemainingBalance = totalStreamPerSec * BigInt(6 * 60 * 60);

	const onWithDraw = async () => {};

	return (
		<Wrapper>
			{step === EModifySuperTokenSteps.MODIFY ? (
				<>
					<ModifyWrapper>
						<ModifySection
							titleLabel='label.withdraw_from_stream_balance'
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
					</ModifyWrapper>
					<ModifyInfoToast />
				</>
			) : (
				<div></div>
			)}
			<Button
				label={formatMessage({ id: actionButtonLabel[step] })}
				disabled={
					step === EModifySuperTokenSteps.MODIFY &&
					(amount <= 0 ||
						SuperTokenBalance === undefined ||
						amount > SuperTokenBalance.value - minRemainingBalance)
				}
				loading={step === EModifySuperTokenSteps.WITHDRAWING}
				onClick={onWithDraw}
			/>
		</Wrapper>
	);
};
