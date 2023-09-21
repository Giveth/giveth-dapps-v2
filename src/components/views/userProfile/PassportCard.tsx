import React from 'react';
import styled from 'styled-components';
import { B, H3, P, neutralColors } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { ContributeCardBox } from '@/components/ContributeCard.sc';
import { EPassportState, usePassport } from '@/hooks/usePassport';
import { Flex } from '@/components/styled-components/Flex';
import { PassportButton } from '@/components/PassportButton';

export const PassportCard = () => {
	const { formatMessage } = useIntl();
	const { info, handleSign, refreshScore } = usePassport();
	const { passportState, passportScore } = info;
	return (
		<StyledContributeCardBox>
			{passportState === EPassportState.NOT_SIGNED ||
			passportState === EPassportState.LOADING ? (
				<B>{formatMessage({ id: 'label.gitcoin_passport' })}</B>
			) : (
				<Flex alignItems='center' justifyContent='space-between'>
					<B>{formatMessage({ id: 'label.passport_score' })}</B>
					<Score weight={700}>
						{passportScore === null ? '--' : passportScore}
					</Score>
				</Flex>
			)}
			<P>{formatMessage({ id: 'component.passport_card.desc' })}</P>
			<Hr></Hr>
			<StyledPassportButton
				state={passportState}
				handleSign={handleSign}
				refreshScore={refreshScore}
			/>
		</StyledContributeCardBox>
	);
};

const StyledContributeCardBox = styled(ContributeCardBox)`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const Score = styled(H3)`
	color: ${neutralColors.gray[800]};
`;

const Hr = styled.div`
	height: 1px;
	background-color: ${neutralColors.gray[300]};
	width: 100%;
`;

const StyledPassportButton = styled(PassportButton)`
	width: fit-content;
`;
