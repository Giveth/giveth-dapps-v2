import { Button, mediaQueries } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Flex } from '@/components/styled-components/Flex';
import { IGiverPFPToken } from '@/apollo/types/types';

interface INFTButtons {
	saveAvatar: () => void;
	setSelectedPFP: (pfp?: IGiverPFPToken) => void;
	nftUrl: () => string | undefined;
}

const NFTButtons = ({ saveAvatar, setSelectedPFP, nftUrl }: INFTButtons) => {
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

	${mediaQueries.tablet} {
		margin-bottom: 0;
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
