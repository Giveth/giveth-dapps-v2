import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import {
	Flex,
	P,
	mediaQueries,
	brandColors,
	neutralColors,
	IconExternalLink,
	OutlineButton,
	B,
} from '@giveth/ui-design-system';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import { useProjectContext } from '@/context/project.context';
import { Shadow } from '@/components/styled-components/Shadow';

const ProjectDevouchBox = () => {
	const { formatMessage } = useIntl();
	const { projectData, isDraft } = useProjectContext();

	if (!projectData || isDraft) {
		return null;
	}
	return (
		<Wrapper>
			<Content>
				<IconWrapper>
					<Image
						src='/images/devouch.svg'
						width={24}
						height={24}
						alt='devouch'
					/>
				</IconWrapper>
				<TextContent>
					<Title>
						{formatMessage({
							id: 'label.devouch.view_this_project',
						})}
					</Title>
					<Description>
						{formatMessage({
							id: 'label.devouch.if_you_are_eligible',
						})}{' '}
						<ExternalLink href={links.DEVOUCH_DOCS}>
							<LearnMore>
								{formatMessage({
									id: 'label.devouch.learn_more_about_devouch',
								})}
							</LearnMore>
						</ExternalLink>
					</Description>
				</TextContent>
			</Content>
			<ButtonWrapper
				target='_blank'
				rel='noopener noreferrer'
				href={`${links.DEVOUCH}/project/giveth/${projectData?.id}`}
			>
				<OutlineButton
					label={formatMessage({
						id: 'label.devouch.attest_on_devouch',
					})}
					leftIcon={
						<IconExternalLink
							size={16}
							color={brandColors.giv[500]}
						/>
					}
				/>
			</ButtonWrapper>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	justify-content: space-between;
	align-items: stretch;
	gap: 16px;
	padding: 24px 16px;
	background: #ffffff;
	border-radius: 16px;
	box-shadow: ${Shadow.Neutral[500]};
	margin-top: 42px;
	flex-direction: column;

	${mediaQueries.tablet} {
		padding: 24px;
		gap: 24px;
		flex-direction: row;
		align-items: center;
	}
`;

const Content = styled(Flex)`
	gap: 16px;
	align-items: flex-start;
`;

const IconWrapper = styled.div`
	flex-shrink: 0;
`;

const TextContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const Title = styled(B)`
	font-weight: bold;
	color: ${neutralColors.gray[900]};
`;

const Description = styled(P)`
	max-width: 859px;
	color: ${neutralColors.gray[700]};
`;

const LearnMore = styled.span`
	color: ${brandColors.pinky[500]};
	text-decoration: none;
	font-size: 14px;
	&:hover {
		text-decoration: underline;
	}
`;

const ButtonWrapper = styled.a`
	width: 100%;

	button {
		border: 2px solid ${brandColors.giv[500]} !important;
		flex-direction: row-reverse;
		color: ${brandColors.giv[500]} !important;
		gap: 2px;
		width: 100%;
		font-weight: 700;
		padding: 12px 16px;

		svg {
			margin-left: 8px;
			flex-shrink: 0;
		}

		span {
			text-transform: capitalize;
		}
	}

	${mediaQueries.tablet} {
		width: auto;

		button {
			width: 213px;
		}
	}
`;

export default ProjectDevouchBox;
