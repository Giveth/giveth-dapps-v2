import ConfettiAnimation from '@/components/animations/confetti';
import {
	brandColors,
	Button,
	H4,
	H6,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

import { mediaQueries } from '@/lib/constants/constants';
import { IProject } from '@/apollo/types/types';
import links from '@/lib/constants/links';
import Routes from '@/lib/constants/Routes';
import SocialBox from '@/components/views/donate/SocialBox';
import ExternalLink from '@/components/ExternalLink';

const SuccessView = (props: {
	txLink: string;
	project: IProject;
	givBackEligible: boolean;
}) => {
	const { txLink, project, givBackEligible } = props;
	return (
		<SucceessContainer>
			<ConfettiContainer>
				<ConfettiAnimation size={300} />
			</ConfettiContainer>
			<GiverH4>You're a giver now!</GiverH4>
			<SuccessMessage>
				Thank you for supporting {project?.title}. Your contribution
				goes a long way!
			</SuccessMessage>
			{givBackEligible && (
				<GivBackContainer>
					<H6>You&#39;re eligible for GIVbacks!</H6>
					<P>
						GIV rewards from the GIVbacks program will be
						distributed after the end of the current round.
					</P>
					<ExternalLink href={links.GIVBACK_DOC}>
						<LearnButton label='LEARN MORE' />
					</ExternalLink>
				</GivBackContainer>
			)}
			{!givBackEligible && <SocialBox project={project} isSuccess />}
			<Options>
				<P style={{ color: neutralColors.gray[900] }}>
					Your transaction has been submitted.
				</P>
				<TxLink>
					<ExternalLink href={txLink} title='View on explorer' />
				</TxLink>
				<Link passHref href={Routes.Projects}>
					<ProjectsButton label='SEE MORE PROJECTS' />
				</Link>
			</Options>
		</SucceessContainer>
	);
};

const TxLink = styled(P)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
	margin: 8px 0 24px 0;
`;

const ConfettiContainer = styled.div`
	position: absolute;
	top: 200px;
`;

const GiverH4 = styled(H4)`
	color: ${brandColors.deep[700]};
`;

const SucceessContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	text-align: center;
	padding: 0 39px;
	color: ${brandColors.deep[900]};
	height: 100%;
	${mediaQueries['mobileS']} {
		padding: 0;
	}
`;

const SuccessMessage = styled(P)`
	margin: -19px 0 16px 0;
	color: ${brandColors.deep[900]};
	${mediaQueries['mobileS']} {
		margin: 16px 0;
	}
`;

const Options = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	justify-content: center;
	align-items: center;
`;

const ProjectsButton = styled(Button)`
	width: 242px;
	height: 48px;
	font-size: 12px;
`;

const LearnButton = styled(Button)`
	width: 200px;
	height: 48px;
	font-size: 16px;
	border-color: white;
	margin: 16px 0 0 0;
`;

const GivBackContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 454px;
	height: 212px;
	padding: 0 53px;
	align-items: center;
	background-image: url('/images/GIVeconomy_Banner.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	border-radius: 12px;
	color: white;
	h6 {
		font-weight: bold;
		margin: 0 0 8px 0;
	}
	${mediaQueries.mobileS} {
		width: 100%;
	}
`;

export default SuccessView;
