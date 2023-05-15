import {
	Subline,
	H3,
	ButtonLink,
	H4,
	neutralColors,
	Caption,
	B,
	P,
	IconChevronRight16,
	brandColors,
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
				<DonateInfo>
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
				</DonateInfo>
			) : (
				<DonateInfo>
					<NoFund weight={700}>
						{formatMessage({
							id: 'label.donate_first_lead_the_way',
						})}
					</NoFund>
				</DonateInfo>
			)}
			<DonateDescription flexDirection='column' gap='8px'>
				<B>100% to the project. Always.</B>
				<P>
					Every donation is peer-to-peer, with no fees and no
					middlemen.
				</P>
				<a href='/' target='_blank' referrerPolicy='no-referrer'>
					<LearnLink alignItems='center' gap='2px'>
						<Subline>Learn about our zero-fee policy</Subline>
						<IconChevronRight16 />
					</LearnLink>
				</a>
			</DonateDescription>
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

const DonateInfo = styled.div`
	height: 130px;
`;

const NoFund = styled(H4)`
	color: ${neutralColors.gray[800]};
	margin-top: 16px;
`;

const DonateDescription = styled(Flex)`
	padding: 8px 16px;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 16px;
`;

const LearnLink = styled(Flex)`
	color: ${brandColors.pinky[500]};
	&:hover {
		color: ${brandColors.pinky[700]};
	}
`;
