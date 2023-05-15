import {
	Subline,
	H3,
	ButtonLink,
	H4,
	neutralColors,
	Caption,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { slugToProjectDonate } from '@/lib/routeCreators';
import { useProjectContext } from '@/context/project.context';
import { Flex } from '@/components/styled-components/Flex';

export const DonateSection = () => {
	const { formatMessage, locale } = useIntl();
	const { projectData, isActive, totalDonationsCount } = useProjectContext();
	const { slug, totalDonations } = projectData || {};
	return (
		<DonationSectionWrapper flexDirection='column'>
			{totalDonations && totalDonations !== 0 ? (
				<Flex gap='8px' flexDirection='column'>
					<Title>
						{formatMessage({
							id: 'label.amount_raised',
						})}
					</Title>
					<Amount weight={700}>
						${totalDonations.toLocaleString(locale)}
					</Amount>
					<Description>
						{formatMessage({
							id: 'label.raised_from',
						})}
						<Caption medium>{totalDonationsCount}</Caption>
						{formatMessage(
							{
								id: 'label.contributors',
							},
							{
								count: totalDonationsCount,
							},
						)}
					</Description>
				</Flex>
			) : (
				<NoFund weight={700}>
					{formatMessage({ id: 'label.donate_first_lead_the_way' })}
				</NoFund>
			)}
			<Link href={slugToProjectDonate(slug || '')}>
				<ButtonLink
					label={formatMessage({ id: 'label.donate' })}
					disabled={!isActive}
				/>
			</Link>
		</DonationSectionWrapper>
	);
};

const Title = styled(Subline)`
	margin-bottom: 8px;
`;

const Amount = styled(H3)`
	margin-bottom: 4px;
`;

const Description = styled(Caption)`
	color: ${neutralColors.gray[700]};
	margin-bottom: 24px;
	& > div {
		color: ${neutralColors.gray[900]};
		display: inline;
	}
`;

const DonationSectionWrapper = styled(Flex)`
	height: 206px;
	justify-content: space-between;
`;

const NoFund = styled(H4)`
	color: ${neutralColors.gray[800]};
`;
