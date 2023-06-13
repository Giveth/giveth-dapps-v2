import {
	brandColors,
	H4,
	H6,
	OutlineButton,
	P,
} from '@giveth/ui-design-system';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import links from '@/lib/constants/links';
import SocialBox from '@/components/SocialBox';
import ExternalLink from '@/components/ExternalLink';
import { client } from '@/apollo/apolloClient';
import { FETCH_GIVETH_PROJECT_BY_ID } from '@/apollo/gql/gqlProjects';
import config from '@/configuration';
import { slugToProjectView } from '@/lib/routeCreators';
import { IFetchGivethProjectGQL } from '@/apollo/types/gqlTypes';
import { useDonateData } from '@/context/donate.context';
import CongratsAnimation from '@/animations/congrats.json';
import LottieControl from '@/components/LottieControl';
import { EContentType } from '@/lib/constants/shareContent';
import QFToast from '@/components/views/donate/QFToast';

const SuccessView: FC = () => {
	const { isSuccessDonation } = useDonateData();
	const { givBackEligible, txHash = [] } = isSuccessDonation || {};
	const hasMultipleTxs = txHash.length > 1;

	const [givethSlug, setGivethSlug] = useState<string>('');
	const { project } = useDonateData();

	const message = hasMultipleTxs ? (
		<>
			Thank you for supporting {project?.title} and thanks for your
			donation to the Giveth DAO! You can check out the Giveth DAO project{' '}
			<ExternalLink href={slugToProjectView(givethSlug)} title='here' />.
		</>
	) : (
		`Thank you for supporting ${project?.title}. Your contribution goes a long way!`
	);

	useEffect(() => {
		client
			.query({
				query: FETCH_GIVETH_PROJECT_BY_ID,
				variables: { id: config.GIVETH_PROJECT_ID },
				fetchPolicy: 'no-cache',
			})
			.then((res: IFetchGivethProjectGQL) =>
				setGivethSlug(res.data.projectById.slug),
			);
	}, []);

	return (
		<SuccessContainer>
			<ConfettiContainer>
				<LottieControl size={400} animationData={CongratsAnimation} />
			</ConfettiContainer>
			<GiverH4 weight={700}>You&#39;re a giver now!</GiverH4>
			<SuccessMessage>{message}</SuccessMessage>
			{givBackEligible && (
				<GivBackContainer>
					<H6>You&#39;re eligible for GIVbacks!</H6>
					<P>
						GIV rewards from the GIVbacks program will be
						distributed after the end of the current round.
					</P>
					<ExternalLink href={links.GIVBACK_DOC}>
						<LearnButton size='small' label='LEARN MORE' />
					</ExternalLink>
				</GivBackContainer>
			)}
			<QFToast />
			<SocialBoxWrapper>
				<SocialBox
					project={project}
					contentType={EContentType.justDonated}
				/>
			</SocialBoxWrapper>
		</SuccessContainer>
	);
};

const SocialBoxWrapper = styled.div`
	margin: -50px 0;
`;

const ConfettiContainer = styled.div`
	position: absolute;
	top: 30px;
`;

const GiverH4 = styled(H4)`
	color: ${brandColors.deep[700]};
`;

const SuccessContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	text-align: center;
	color: ${brandColors.deep[900]};
	height: 100%;
	padding: 0;
`;

const SuccessMessage = styled(P)`
	position: relative;
	margin: 16px 0 30px;
	color: ${brandColors.deep[900]};
	a {
		color: ${brandColors.pinky[500]};
	}
`;

const LearnButton = styled(OutlineButton)`
	width: 200px;
	height: 48px;
	border-color: white;
	margin: 16px 0 0 0;
`;

const GivBackContainer = styled.div`
	width: 100%;
	padding: 32px 53px;
	text-align: center;
	background-image: url('/images/GIVeconomy_Banner.png');
	background-size: cover;
	border-radius: 12px;
	color: white;
	z-index: 1;
	> h6 {
		font-weight: bold;
		margin: 0 0 8px 0;
	}
`;

export default SuccessView;
