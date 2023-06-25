import React from 'react';
import {
	B,
	ButtonLink,
	IconChevronRight24,
	IconGIVBack,
	P,
	brandColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Flex } from '@/components/styled-components/Flex';
import ExternalLink from '@/components/ExternalLink';
import { useProjectContext } from '@/context/project.context';

const GIVPowerGetReward = () => {
	const { formatMessage } = useIntl();
	const { projectData } = useProjectContext();
	const { givbackFactor } = projectData || {};

	if (givbackFactor === 0) return null;

	return (
		<Wrapper>
			<Flex gap='20px'>
				<div>
					<IconGIVBack size={24} color='black' />
				</div>
				<Flex flexDirection='column' gap='4px'>
					<B>
						{formatMessage({
							id: 'label.get_rewarded_with',
						})}
						{Math.round(+(givbackFactor || 0) * 100)}%
						{formatMessage({
							id: 'label.ofـyourـdonationـvalue',
						})}
					</B>
					<P>
						{formatMessage({
							id: 'label.donors_to_verified',
						})}
					</P>
					<CustomizedExternalLink href='https://docs.giveth.io/giveconomy/givbacks/'>
						<LearnMoreButton
							linkType='texty-secondary'
							label={formatMessage({
								id: 'label.learn_more',
							})}
							icon={<IconChevronRight24 />}
						/>
					</CustomizedExternalLink>
				</Flex>
			</Flex>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin-top: 24px;
	border: 2px solid ${brandColors.giv[500]};
	border-radius: 16px;
	padding: 16px 24px;
`;

const LearnMoreButton = styled(ButtonLink)`
	display: flex;
	flex-grow: 0;
	justify-content: flex-start;
	padding-left: 0;
	padding-right: 0;
	color: ${brandColors.pinky[500]};
	width: auto;
	&:hover {
		background-color: unset;
		color: ${brandColors.pinky[600]};
	}
	& span {
		font-weight: 400;
		text-transform: capitalize;
	}
`;

const CustomizedExternalLink = styled(ExternalLink)`
	width: fit-content;
`;

export default GIVPowerGetReward;
