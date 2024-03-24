import {
	Subline,
	neutralColors,
	B,
	P,
	IconChevronRight16,
	brandColors,
	mediaQueries,
	Flex,
	H5,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { type FC } from 'react';
import Link from 'next/link';
import { formatDonation } from '@/helpers/number';
import { IProject } from '@/apollo/types/types';
import { VerifiedBadge } from '@/components/badges/VerifiedBadge';
import { slugToProjectView } from '@/lib/routeCreators';
import { ProjectCardUserName } from '@/components/project-card/ProjectCardUserName';
import { ORGANIZATION } from '@/lib/constants/organizations';

interface IDonatePageProjectDescriptionProps {
	projectData?: IProject;
}

export const DonatePageProjectDescription: FC<
	IDonatePageProjectDescriptionProps
> = ({ projectData }) => {
	const { formatMessage, locale } = useIntl();
	const {
		sumDonationValueUsd,
		slug,
		title,
		descriptionSummary,
		adminUser,
		organization,
	} = projectData || {};

	const orgLabel = organization?.label;
	const isForeignOrg =
		orgLabel !== ORGANIZATION.trace && orgLabel !== ORGANIZATION.giveth;

	const projectLink = slugToProjectView(slug!);

	return (
		<DonationSectionWrapper gap='16px'>
			{projectData?.verified && (
				<Flex>
					<VerifiedBadge />
				</Flex>
			)}
			<Link href={projectLink}>
				<CustomH5>{title}</CustomH5>
			</Link>
			<ProjectCardUserName
				name={adminUser?.name}
				adminUser={adminUser!}
				slug={slug!}
				isForeignOrg={isForeignOrg}
				sidePadding='0'
			/>
			<P>
				{formatMessage({ id: 'label.raised' })}:{' '}
				{formatDonation(sumDonationValueUsd || 0, '$', locale)}
			</P>
			<DescriptionSummary>{descriptionSummary}</DescriptionSummary>
			<DonateDescription $flexDirection='column' gap='8px'>
				<B>
					{formatMessage({
						id: 'component.donation_section.100_to_the_project',
					})}
				</B>
				<B></B>
				<P>
					{formatMessage({
						id: 'component.donation_section.desc',
					})}
				</P>
				<a
					href='https://docs.giveth.io/whatisgiveth/zero-fees'
					target='_blank'
					referrerPolicy='no-referrer'
					rel='noreferrer'
				>
					<LearnLink $alignItems='center' gap='2px'>
						<Subline>
							{formatMessage({
								id: 'component.donation_section.learn_zero_fee',
							})}
						</Subline>
						<IconChevronRight16 />
					</LearnLink>
				</a>
			</DonateDescription>
		</DonationSectionWrapper>
	);
};

const CustomH5 = styled(H5)`
	font-weight: 700;
`;

const DescriptionSummary = styled(P)`
	max-height: 75px;
	overflow: hidden;
	color: ${neutralColors.gray[800]};
	margin-bottom: 16px;
`;

const DonationSectionWrapper = styled(Flex)`
	justify-content: space-between;
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
	${mediaQueries.laptopS} {
		flex-direction: column;
	}
`;

const DonateDescription = styled(Flex)`
	padding: 8px 16px;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 16px;
	margin-bottom: 24px;
	margin-top: 10px;
`;

const LearnLink = styled(Flex)`
	color: ${brandColors.pinky[500]};
	&:hover {
		color: ${brandColors.pinky[700]};
	}
`;
