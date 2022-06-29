import {
	brandColors,
	H5,
	H6,
	IconRocketInSpace32,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { Flex } from '@/components/styled-components/Flex';
import { formatWeiHelper } from '@/helpers/number';
import type { FC } from 'react';

interface ITotalGIVpowerBox {
	totalGIVpower: BigNumber;
}

const TotalGIVpowerBox: FC<ITotalGIVpowerBox> = ({ totalGIVpower }) => {
	return (
		<BoxContainer>
			<H6>You Have</H6>
			<BoxRow alignItems='baseline' gap='8px' justifyContent='center'>
				<IconWrapper>
					<IconRocketInSpace32 />
				</IconWrapper>
				<H5 weight={700}>{formatWeiHelper(totalGIVpower, 2)}</H5>
				<H6>GIVpower</H6>
			</BoxRow>
		</BoxContainer>
	);
};

const BoxContainer = styled.div`
	background: ${brandColors.giv[500]};
	border-radius: 16px;
	padding: 24px;
	margin: 24px 0;
`;

const IconWrapper = styled.div`
	color: ${brandColors.mustard[500]};
`;

const BoxRow = styled(Flex)`
	margin-top: 18px;
`;

export default TotalGIVpowerBox;
