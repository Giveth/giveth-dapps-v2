import styled from 'styled-components';
import { ButtonLink, neutralColors, QuoteText } from '@giveth/ui-design-system';
import Link from 'next/link';
import { FlexCenter } from '@/components/styled-components/Flex';
import Routes from '@/lib/constants/Routes';
import { useAppSelector } from '@/features/hooks';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';

export const EmptyPowerBoosting = () => {
	const sdh = new SubgraphDataHelper(
		useAppSelector(state => state.subgraph.xDaiValues),
	);
	const givPower = sdh.getUserGIVPowerBalance();
	return (
		<EmptyPowerBoostingContainer direction='column'>
			{givPower.balance === '0' ? (
				<>
					<Title size='small'>
						You didn’t boost any project before!
						<br />
						Go to the projects and find a good project to boost
					</Title>
					<br />
					<Link href={Routes.Projects} passHref>
						<ButtonLink label='Go to projects' size='small' />
					</Link>
				</>
			) : (
				<></>
			)}
		</EmptyPowerBoostingContainer>
	);
};

const EmptyPowerBoostingContainer = styled(FlexCenter)`
	height: 630px;
`;

const Title = styled(QuoteText)`
	text-align: center;
	color: ${neutralColors.gray[800]};
`;
