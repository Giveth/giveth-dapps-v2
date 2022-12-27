import styled from 'styled-components';
import { ButtonLink, neutralColors, QuoteText } from '@giveth/ui-design-system';
import Link from 'next/link';
import { FC } from 'react';
import { FlexCenter } from '@/components/styled-components/Flex';
import Routes from '@/lib/constants/Routes';
import { useAppSelector } from '@/features/hooks';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
interface IEmptyPowerBoosting {
	myAccount?: boolean;
}

export const EmptyPowerBoosting: FC<IEmptyPowerBoosting> = ({ myAccount }) => {
	const sdh = new SubgraphDataHelper(
		useAppSelector(state => state.subgraph.xDaiValues),
	);
	const givPower = sdh.getUserGIVPowerBalance();
	return (
		<EmptyPowerBoostingContainer direction='column'>
			{!myAccount ? (
				<Title size='small'>
					This user hasn&apos;t started boosting with GIVpower yet!
				</Title>
			) : givPower.balance === '0' ? (
				<>
					<Title size='small'>
						You don&apos;t have any GIVpower yet!
						<br />
						Stake and lock GIV to get GIVpower and starting boosting
						projects.
					</Title>
					<br />
					<Link href={Routes.GIVfarm}>
						<ButtonLink label='Get GIVpower' size='small' />
					</Link>
				</>
			) : (
				<>
					<Title size='small'>
						You haven&apos;t boosted any projects yet!
						<br />
						Use your GIVpower to support projects you love.
					</Title>
					<br />
					<Link href={Routes.Projects}>
						<ButtonLink label='Go to projects' size='small' />
					</Link>
				</>
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
