import {
	Subline,
	H3,
	ButtonLink,
	H4,
	neutralColors,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { slugToProjectDonate } from '@/lib/routeCreators';
import { useProjectContext } from '@/context/project.context';
import { Flex } from '@/components/styled-components/Flex';

export const DonateSection = () => {
	const { formatMessage, locale } = useIntl();
	const { projectData, isActive } = useProjectContext();
	const { slug, totalDonations } = projectData || {};
	return (
		<DonationSectionWrapper flexDirection='column'>
			{totalDonations && totalDonations !== 0 ? (
				<Flex gap='8px' flexDirection='column'>
					<Subline>
						{formatMessage({
							id: 'label.all_time_funding',
						})}
					</Subline>
					<H3 weight={700}>
						${totalDonations.toLocaleString(locale)}
					</H3>
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

const DonationSectionWrapper = styled(Flex)`
	height: 206px;
	justify-content: space-between;
`;

const NoFund = styled(H4)`
	color: ${neutralColors.gray[800]};
`;
