import {
	Subline,
	neutralColors,
	H4,
	H3,
	ButtonLink,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { useProjectContext } from '@/context/project.context';
import { Flex } from '@/components/styled-components/Flex';
import { slugToProjectDonate } from '@/lib/routeCreators';

export const ProjectActionCard = () => {
	return (
		<ProjectActionCardWrapper>
			<DonateSection />
		</ProjectActionCardWrapper>
	);
};

const DonateSection = () => {
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

const ProjectActionCardWrapper = styled.div`
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
	height: 100%;
	padding: 32px 24px 24px;
`;

const NoFund = styled(H4)`
	color: ${neutralColors.gray[800]};
`;
