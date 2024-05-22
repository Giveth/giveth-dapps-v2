import {
	brandColors,
	Col,
	Container,
	H3,
	Lead,
	Row,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import ExternalLink from '@/components/ExternalLink';
import { OvalHorizontalGradient, OvalVerticalGradient } from '../common.styles';
import links from '@/lib/constants/links';

const WhatElse = () => {
	const { formatMessage } = useIntl();
	return (
		<WhatElseContainer>
			<StyledContainer>
				<Row>
					<Col sm={12} lg={6}>
						<HeaderTitle>
							{formatMessage({
								id: 'label.become_project_nominator',
							})}
						</HeaderTitle>
						<Lead>
							{formatMessage({
								id: 'label.givers_pfp_holders',
							})}
							<p>
								<DocLink href={links.TWITTER}>
									{formatMessage({
										id: 'label.keep_eye_on_twitter',
									})}
									{'  '}
								</DocLink>
								{formatMessage({
									id: 'label.to_know_next_givers_round',
								})}{' '}
							</p>
						</Lead>
					</Col>
					<Col sm={12} lg={6}>
						<HeaderTitle>
							{formatMessage({
								id: 'label.unlock_your',
							})}
						</HeaderTitle>
						<Lead>
							{formatMessage({
								id: 'label.if_you_hold_a_giver',
							})}{' '}
							<DocLink href='https://docs.giveth.io/dapps/giverspfp/#benefits'>
								{formatMessage({
									id: 'label.learn_more_about',
								})}
							</DocLink>
						</Lead>
					</Col>
				</Row>
			</StyledContainer>
			<OvalHorizontalGradient />
			<OvalVerticalGradient />
		</WhatElseContainer>
	);
};

const WhatElseContainer = styled.div`
	padding-top: 100px;
	position: relative;
	&::before {
		content: ' ';
		position: absolute;
		background-image: url('/images/GIV_homepage.svg');
		width: 100%;
		height: 100%;
		max-height: 400px;
		z-index: 1;
		opacity: 0.15;
		overflow: hidden;
	}
`;

const DocLink = styled(ExternalLink)`
	color: ${brandColors.giv[300]};
	font-weight: 500;
	&:hover {
		color: ${brandColors.giv[200]};
	}
`;

const StyledContainer = styled(Container)`
	position: relative;
	z-index: 1;
`;

const HeaderTitle = styled(H3)`
	color: ${brandColors.giv[200]};
`;

export default WhatElse;
