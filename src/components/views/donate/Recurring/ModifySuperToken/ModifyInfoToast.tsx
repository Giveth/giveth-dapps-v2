import React, { FC } from 'react';
import styled from 'styled-components';
import { B, Caption } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import links from '@/lib/constants/links';

interface IModifyInfoToastProps {
	toastType: EToastType;
	withdrawalType?: 'deposit' | 'withdraw';
}

interface IMessage {
	text: string;
}

export const ModifyInfoToast: FC<IModifyInfoToastProps> = ({
	toastType,
	withdrawalType,
}) => {
	const { formatMessage } = useIntl();

	if (toastType === EToastType.Warning) {
		return (
			<InfoToast
				message={
					<Message
						text={formatMessage({
							id: 'toast.warning_stream_balance',
						})}
					/>
				}
				type={toastType}
			></InfoToast>
		);
	} else if (toastType === EToastType.Success) {
		return (
			<InfoToast
				message={formatMessage({
					id:
						withdrawalType === 'withdraw'
							? 'toast.withdrawal_from_your_stream_balance_was_successful'
							: 'toast.deposit_to_your_stream_balance_was_successful',
				})}
				type={toastType}
			></InfoToast>
		);
	}
	return (
		<InfoToast
			message={
				<Message
					text={formatMessage({ id: 'toast.modify_stream_balance' })}
				/>
			}
			type={toastType}
		></InfoToast>
	);
};

const Message: FC<IMessage> = ({ text }) => (
	<Wrapper>
		<Caption>{text}</Caption>{' '}
		<B>
			<a
				href={links.RECURRING_DONATION_DOCS}
				target='noreferrer noopener'
			>
				Learn more
			</a>
		</B>
	</Wrapper>
);

const InfoToast = styled(InlineToast)`
	margin: 0px;
`;

const Wrapper = styled.div`
	& > * {
		display: inline;
	}
`;
