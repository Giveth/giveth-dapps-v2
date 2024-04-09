import React from 'react';
import styled from 'styled-components';
import { Flex } from '@giveth/ui-design-system';
import { ArchivedQFBanner } from './ArchivedQFBanner';
import { EQFPageStatus, QFHeader } from './QFHeader';

export const ArchivedQFView = () => {
	return (
		<Wrapper>
			<ArchivedQFBanner />
			<QFHeader status={EQFPageStatus.ARCHIVED} />
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	gap: 40px;
`;
