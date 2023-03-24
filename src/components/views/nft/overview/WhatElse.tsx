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
import ExternalLink from '@/components/ExternalLink';
import { OvalHorizontalGradient, OvalVerticalGradient } from '../common.styles';

const WhatElse = () => {
	return (
		<WhatElseContainer>
			<StyledContainer>
				<Row>
					<Col sm={12} lg={6}>
						<HeaderTitle>Get your Giveth Name.</HeaderTitle>
						<Lead>
							Givers PFP Holders will be able to claim their own
							unique <code>.giveth</code> domain name at a 50%
							discount, thanks to Punk Domains. Reserve your name
							(e.g. <code>griff.giveth</code>) on Gnosis Chain and
							on top of that, 80% of the registration fees go to
							the Giveth Matching Pool!
							<p>
								Already own a Giver?{' '}
								<DocLink href='https://giveth.punk.domains/#/'>
									Register your <code>.giveth</code> name.
								</DocLink>
							</p>
						</Lead>
					</Col>
					<Col sm={12} lg={6}>
						<HeaderTitle>Unlock your Giveth Flair.</HeaderTitle>
						<Lead>
							If you hold a Giver, you will soon be able to set it
							as your profile picture on the Giveth.io DApp. With
							your Giver equipped, whatever you do on on Giveth,
							boosting with GIVpower, donating or founding a
							project, you will be shown prominently on the
							platform along with your unique Giver NFT badge.{' '}
							<DocLink href='https://docs.giveth.io/dapps/giverspfp/#benefits'>
								Learn more about the benefits.
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
	::before {
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
