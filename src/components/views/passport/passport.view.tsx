import {
	B,
	ButtonText,
	Col,
	Container,
	H2,
	H3,
	IconExternalLink16,
	IconPassport16,
	Lead,
	P,
	Row,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import ExternalLink from '@/components/ExternalLink';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';
import { EPassportState, usePassport } from '@/hooks/usePassport';

export const PassportView = () => {
	const { state, score, currentRound, handleSign, refreshScore } =
		usePassport();

	const isScoreReady =
		state !== EPassportState.NOT_CONNECTED &&
		state !== EPassportState.NOT_SIGNED &&
		state !== EPassportState.LOADING;

	return (
		<Container>
			<Wrapper>
				<Title>Amplify your donation</Title>
				<Lead>
					Unlock matching for your donation by verifying your
					identity! Connect your wallet to Gitcoin Passport to check
					your identity score and maximize your donation power.
					Passport is designed to proactively verify users’ identities
					to protect against Sybil attacks.
				</Lead>
				<PassportLink>
					<ExternalLink href='/' title='Learn more' />
					<IconExternalLink16 />
				</PassportLink>
				{state === EPassportState.NOT_CONNECTED ? (
					<Button onClick={() => {}}>
						<FlexCenter gap='8px'>
							<IconPassport16 />
							<ButtonText>Connect passport</ButtonText>
						</FlexCenter>
					</Button>
				) : state === EPassportState.NOT_SIGNED ? (
					<Button onClick={() => handleSign()}>
						<FlexCenter gap='8px'>
							<IconPassport16 />
							<ButtonText>Connect passport</ButtonText>
						</FlexCenter>
					</Button>
				) : state === EPassportState.LOADING ? (
					<BaseButton>
						<FlexCenter gap='8px'>
							<IconPassport16 />
							<ButtonText>Loading</ButtonText>
						</FlexCenter>
					</BaseButton>
				) : (
					<Button
						onClick={() => {
							refreshScore();
						}}
					>
						<FlexCenter gap='8px'>
							<IconPassport16 />
							<ButtonText>Refresh score</ButtonText>
						</FlexCenter>
					</Button>
				)}
				<Row>
					<StyledCol md={9}>
						<InfoBox>
							<InfoRow>
								<B>Your Passport score</B>
								<H3>
									{score?.passportScore !== undefined
										? score.passportScore
										: '--'}
								</H3>
							</InfoRow>
							<InfoRow>
								<P>Required score</P>
								<H3>
									{currentRound?.minimumPassportScore !==
									undefined
										? currentRound.minimumPassportScore
										: '--'}
								</H3>
							</InfoRow>
						</InfoBox>
					</StyledCol>
				</Row>
			</Wrapper>
		</Container>
	);
};

const Wrapper = styled.div`
	padding: 80px 0;
	text-align: center;
`;

const Title = styled(H2)`
	margin-bottom: 40px;
`;

const PassportLink = styled(FlexCenter)`
	margin-top: 16px;
	margin-bottom: 60px;
	color: ${brandColors.giv[500]};
	gap: 4px;
`;

const BaseButton = styled.button`
	padding: 16px 32px;
	background-color: ${neutralColors.gray[100]};
	border: none;
	border-radius: 48px;
	box-shadow: ${Shadow.Giv[400]};
	transition: color 0.2s ease-in-out;
	cursor: pointer;
`;

const Button = styled(BaseButton)`
	&:hover {
		color: ${neutralColors.gray[800]};
	}
`;

const StyledCol = styled(Col)`
	margin: auto;
`;

const InfoBox = styled(Flex)`
	flex-direction: column;
	gap: 11px;
	margin-top: 60px;
`;

const InfoRow = styled(Flex)`
	justify-content: space-between;
	align-items: center;
`;
