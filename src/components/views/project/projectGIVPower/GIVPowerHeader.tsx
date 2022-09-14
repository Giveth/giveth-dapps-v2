import styled from 'styled-components';
import { H2, H5, Subline } from '@giveth/ui-design-system';
import { FC } from 'react';
import { Shadow } from '@/components/styled-components/Shadow';
import { Flex } from '@/components/styled-components/Flex';
import { Col, Row } from '@/components/Grid';
import { deviceSize, mediaQueries } from '@/lib/constants/constants';
import { IProjectPower } from '@/apollo/types/types';

interface IGIVPowerHeader {
	projectPower?: IProjectPower;
}

const GIVPowerHeader: FC<IGIVPowerHeader> = ({ projectPower }) => {
	return (
		<Container>
			<ColStyled xs={8} sm={7}>
				<Subline>TOTAL GIVPOWER</Subline>
				<Flex gap='4px' alignItems='flex-end'>
					<H2 weight={700}>{projectPower?.totalPower || 0}</H2>
					<H5>GIV</H5>
				</Flex>
			</ColStyled>
			<ColStyled xs={4} sm={5}>
				<Subline>PROJECT RANK</Subline>
				<H2 weight={700}>{projectPower?.powerRank || '--'}</H2>
			</ColStyled>
		</Container>
	);
};

const ColStyled = styled(Col)`
	@media (max-width: ${deviceSize.mobileL}px) {
		width: 100%;
	}
`;

const Container = styled(Row)`
	margin-top: 57px;
	padding: 24px;
	box-shadow: ${Shadow.Neutral[400]};
	border-radius: 12px;
	max-width: 635px;
	flex-direction: column;
	gap: 16px 0;
	${mediaQueries.mobileL} {
		flex-direction: row;
	}
`;

export default GIVPowerHeader;
