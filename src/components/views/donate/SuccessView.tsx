import {
	brandColors,
	Button,
	H4,
	H6,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import React, { FC } from 'react';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';

import ConfettiAnimation from '@/components/animations/confetti';
import { IProject } from '@/apollo/types/types';
import links from '@/lib/constants/links';
import Routes from '@/lib/constants/Routes';
import SocialBox from '@/components/views/donate/SocialBox';
import ExternalLink from '@/components/ExternalLink';
import { FlexCenter } from '@/components/styled-components/Flex';
import { formatTxLink } from '@/lib/helpers';

interface IProps {
	project: IProject;
	txHash: string[];
	givBackEligible?: boolean;
}

const SuccessView: FC<IProps> = props => {
	const { txHash, project, givBackEligible } = props;
	const hasMultipleTxs = txHash.length > 1;
	const { chainId } = useWeb3React();
	const message = hasMultipleTxs
		? `Thank you for supporting ${project?.title} and We're also grateful for your donation to the Giveth DAO, you can check out our more of projects on Giveth.`
		: `Thank you for supporting ${project?.title}. Your contribution goes a long way!`;

	return (
		<SuccessContainer>
			<ConfettiContainer>
				<ConfettiAnimation size={300} />
			</ConfettiContainer>
			<GiverH4 weight={700}>You're a giver now!</GiverH4>
			<SuccessMessage>{message}</SuccessMessage>
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
				{hasMultipleTxs ? (
					<>
						<TxLink>
							<ExternalLink
								href={formatTxLink(chainId, txHash[0])}
								title='View  donation to project on Etherscan'
							/>
						</TxLink>
						<TxLink>
							<ExternalLink
								href={formatTxLink(chainId, txHash[1])}
								title='View donation to Giveth on Etherscan'
							/>
						</TxLink>
					</>
				) : (
					<TxLink>
						<ExternalLink
							href={formatTxLink(chainId, txHash[0])}
							title='View on Etherscan'
						/>
					</TxLink>
				)}
				<Link passHref href={Routes.Projects}>
					<ProjectsButton size='small' label='SEE MORE PROJECTS' />
				</Link>
			</Options>
		</SuccessContainer>
	);
};

const TxLink = styled(P)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
	margin-top: 8px;
`;

const ConfettiContainer = styled.div`
	position: absolute;
	top: 200px;
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
`;

const Options = styled(FlexCenter)`
	flex-direction: column;
	width: 100%;
	margin-top: 24px;
`;

const ProjectsButton = styled(Button)`
	width: 242px;
	margin-top: 24px;
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
	width: 100%;
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
`;

export default SuccessView;
