import { Button, mediaQueries } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Flex } from '@/components/styled-components/Flex';
import { IGiverPFPToken } from '@/apollo/types/types';

export interface INFTButtons {
	saveAvatar: () => void;
	setSelectedPFP: (pfp?: IGiverPFPToken) => void;
	nftUrl: () => string | undefined;
	loading: boolean;
}

const NFTButtons = ({
	loading,
	saveAvatar,
	setSelectedPFP,
	nftUrl,
}: INFTButtons) => {
	const { formatMessage } = useIntl();

	return (
		<NFTsButtonsContainer
			flexDirection='row'
			justifyContent='space-between'
		>
			<Button
				buttonType='secondary'
				label='SAVE'
				disabled={!nftUrl()}
				onClick={() => saveAvatar()}
				loading={loading}
			/>
			<TextButton
				buttonType='texty'
				label={formatMessage({
					id: 'label.cancel',
				})}
				onClick={() => {
					setSelectedPFP(undefined);
				}}
			/>
		</NFTsButtonsContainer>
	);
};

export default NFTButtons;

const NFTsButtonsContainer = styled(Flex)`
	margin-bottom: 60px;
	margin-top: 8px;
	width: 100%;
	${mediaQueries.tablet} {
		margin-bottom: 20px;
		padding: 0 20px;
	}
`;

const TextButton = styled(Button)<{ color?: string }>`
	color: ${props => props.color};
	text-transform: uppercase;

	&:hover {
		background-color: transparent;
		color: ${props => props.color};
	}
`;
