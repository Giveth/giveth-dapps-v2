import React from 'react';
import styled from 'styled-components';
import { Container, Flex } from '@giveth/ui-design-system';
import { ArchivedQFBanner } from './ArchivedQFBanner';
import { EQFPageStatus, QFHeader } from './QFHeader';

export const ArchivedQFView = () => {
	return (
		<Wrapper>
			<ArchivedQFBanner />
			<Container>
				<QFHeader status={EQFPageStatus.ARCHIVED} />
			</Container>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	gap: 40px;
`;
