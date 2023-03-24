import { FC } from 'react';
import styled from 'styled-components';
import {
	B,
	IconArrowRight,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import { shortenAddress } from '@/lib/helpers';
import { Shadow } from '@/components/styled-components/Shadow';
import ExternalLink from '@/components/ExternalLink';
import { slugToProjectView } from '@/lib/routeCreators';
import { EProjectPageTabs } from '../../project/ProjectIndex';

interface IDonationCard {
	address: string;
	amount: number;
	projectTitle: string;
	slug: string;
}

const DonationCard: FC<IDonationCard> = props => {
	const { address, amount, projectTitle, slug } = props;
	return (
		<CardWrapper>
			<ExternalLink
				href={
					slugToProjectView(slug) +
					'?tab=' +
					EProjectPageTabs.DONATIONS
				}
			>
				<CardContainer>
					<Section>
						<B>{'@' + shortenAddress(address?.toLowerCase())}</B>
						<div>donated</div>
						<Amount>{'~$' + amount.toFixed(1)}</Amount>
					</Section>
					<Section>
						<Arrow>
							<IconArrowRight />
						</Arrow>
						<Title>{projectTitle}</Title>
					</Section>
				</CardContainer>
			</ExternalLink>
		</CardWrapper>
	);
};

const Section = styled(Flex)`
	gap: 8px;
	align-items: center;
	width: max-content;
`;

const Arrow = styled(Flex)`
	margin: 0 3px;
	color: ${neutralColors.gray[900]};
`;

const Title = styled(B)`
	color: ${neutralColors.gray[900]};
`;

const Amount = styled(B)`
	padding: 0 8px;
	border-radius: 4px;
	background: ${neutralColors.gray[300]};
`;

const CardWrapper = styled.div`
	padding: 30px 4px;
`;

const CardContainer = styled(Flex)`
	color: ${neutralColors.gray[700]};
	padding: 8px 24px;
	border-radius: 12px;
	border: 1px solid ${neutralColors.gray[300]};
	flex-direction: column;
	width: 100%;
	background: white;
	cursor: pointer;
	transition: box-shadow 0.3s ease-in-out;
	:hover {
		box-shadow: ${Shadow.Ocean[400]};
		transition: box-shadow 0.3s ease-in-out;
	}
	${mediaQueries.tablet} {
		border-radius: 100px;
		flex-direction: row;
	}
`;

export default DonationCard;
