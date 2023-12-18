import React from 'react';
import styled from 'styled-components';
import {
	Caption,
	IconInfoFilled16,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';

export const WrongNetworkLayer = () => {
	return (
		<Overlay>
			<Toast>
				<Header>
					<Title gap='4px' alignItems='center'>
						<IconInfoFilled16 />
						<Caption>
							Recurring donations are currently only available on
							Optimism
						</Caption>
					</Title>
				</Header>
			</Toast>
		</Overlay>
	);
};

const Overlay = styled(FlexCenter)`
	position: absolute;
	z-index: 100;
	width: 100%;
	height: 100%;
	background-color: rgba(255, 255, 255, 0.7);
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	backdrop-filter: blur(2px);
`;

const Toast = styled.div`
	padding: 16px;
	border-radius: 8px;
	border: 1px solid ${brandColors.giv[500]};
	background: #fff;
`;

const Header = styled(Flex)`
	padding-bottom: 4px;
	border-bottom: 1px solid ${neutralColors.gray[400]};
`;

const Title = styled(Flex)`
	color: ${brandColors.giv[500]};
`;
