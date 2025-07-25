import {
	Subline,
	H3,
	H4,
	neutralColors,
	Caption,
	B,
	P,
	IconChevronRight16,
	brandColors,
	mediaQueries,
	Flex,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { type FC } from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import { formatDonation } from '@/helpers/number';
import { IProject } from '@/apollo/types/types';
import { useDonateData } from '@/context/donate.context';
import { ORGANIZATION } from '@/lib/constants/organizations';
import links from '@/lib/constants/links';
import { EProjectType } from '@/apollo/types/gqlEnums';

interface IDonateSectionProps {
	projectData?: IProject;
}

export const DonateSection: FC<IDonateSectionProps> = ({ projectData }) => {
	const { formatMessage, locale } = useIntl();
	const { totalDonations, totalDistributed, activeProjectsCount } =
		projectData || {};
	const isMobile = !useMediaQuery(device.tablet);
	const { project } = useDonateData();

	return (
		<DonationSectionWrapper gap='24px'>
			{totalDonations && totalDonations !== 0 ? (
				<DonateInfo>
					{isMobile && <br />}
					<Title>
						{formatMessage({ id: 'label.total_amount_raised' })}
					</Title>
					<Amount weight={700}>
						{formatDonation(totalDonations || 0, '$', locale)}
					</Amount>
					<Description>
						{formatMessage({
							id: 'label.raised_from',
						})}
						<Caption $medium>
							{projectData?.countUniqueDonors}
						</Caption>
						{formatMessage(
							{
								id: 'label.contributors',
							},
							{
								count: projectData?.countUniqueDonors,
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
			{totalDistributed !== undefined &&
				totalDonations !== 0 &&
				projectData?.projectType === EProjectType.CAUSE && (
					<DonateInfoContributed>
						{isMobile && <br />}
						<Title>
							{formatMessage({
								id: 'label.cause.total_distributed',
							})}
						</Title>
						<Amount weight={700}>
							{formatDonation(totalDistributed || 0, '$', locale)}
						</Amount>
						<Description>
							{formatMessage(
								{
									id: 'label.cause.total_distributed_projects',
								},
								{
									count: (
										<Caption $medium>
											{activeProjectsCount || 0}
										</Caption>
									),
								},
							)}
						</Description>
					</DonateInfoContributed>
				)}
			{projectData?.projectType !== EProjectType.CAUSE &&
				(project?.organization?.label ===
				ORGANIZATION.endaoment ? null : (
					<DonateDescription $flexDirection='column' gap='8px'>
						<B>
							{formatMessage({
								id: 'component.donation_section.100_to_the_project',
							})}
						</B>
						<P>
							{formatMessage({
								id: 'component.donation_section.desc',
							})}
						</P>
						<a
							href={links.ZERO_FEES}
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
				))}
		</DonationSectionWrapper>
	);
};

const Title = styled(Subline)`
	display: inline-block;
	margin-bottom: 8px;
	color: ${neutralColors.gray[700]};
	background-color: ${neutralColors.gray[200]};
	border-radius: 4px;
	padding: 2px 4px;
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
	justify-content: space-between;
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
	${mediaQueries.laptopS} {
		flex-direction: column;
	}
`;

const DonateInfo = styled.div`
	height: 130px;
`;

const DonateInfoContributed = styled(DonateInfo)`
	height: auto;
`;

const NoFund = styled(H4)`
	color: ${neutralColors.gray[800]};
	margin-top: 16px;
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
