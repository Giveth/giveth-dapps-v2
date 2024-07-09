import {
	B,
	Button,
	Col,
	Container,
	H2,
	H3,
	H5,
	IconExternalLink16,
	IconPassport32,
	Lead,
	P,
	Row,
	brandColors,
	neutralColors,
	Flex,
	FlexCenter,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import ExternalLink from '@/components/ExternalLink';
import {
	EPassportState,
	EQFElegibilityState,
	usePassport,
} from '@/hooks/usePassport';
import {
	PassportBannerData,
	PassportBannerWrapper,
} from '@/components/PassportBanner';
import { PassportButton } from '@/components/PassportButton';
import links from '@/lib/constants/links';
import { useGeneralWallet } from '@/providers/generalWalletProvider';

export const PassportView = () => {
	const { formatMessage, locale } = useIntl();
	const { info, handleSign, refreshScore } = usePassport();
	const { isOnSolana, handleSingOutAndSignInWithEVM } = useGeneralWallet();

	const { passportScore, passportState, qfEligibilityState, currentRound } =
		info;

	const isScoreReady =
		passportState !== EPassportState.NOT_CONNECTED &&
		passportState !== EPassportState.NOT_SIGNED &&
		passportState !== EPassportState.LOADING;

	if (isOnSolana) {
		return (
			<Container>
				<Wrapper>
					<B>
						{formatMessage({
							id: 'label.to_activate_your_gitcoin_passport',
						})}
					</B>
					<br />
					<FlexCenter>
						<Button
							label={formatMessage({
								id: 'label.switch_to_evm',
							})}
							onClick={handleSingOutAndSignInWithEVM}
							buttonType='primary'
						/>
					</FlexCenter>
				</Wrapper>
			</Container>
		);
	}

	return (
		<Container>
			<Wrapper>
				<Title>
					{formatMessage({
						id: 'label.amplify_your_donation',
					})}
				</Title>
				<PassportRow>
					<IconPassport32 />
					<H5 weight={700}>Gitcoin Passport</H5>
				</PassportRow>
				<Lead>
					{formatMessage({
						id: 'label.amplify_your_donation_desc',
					})}
				</Lead>
				<PassportLink>
					<ExternalLink
						href={links.PASSPORT}
						title={formatMessage({
							id: 'label.go_to_passport',
						})}
					/>
					<IconExternalLink16 />
				</PassportLink>
				<PassportButton
					state={passportState}
					handleSign={handleSign}
					refreshScore={refreshScore}
				/>
				<Row>
					<StyledCol md={9}>
						<InfoBox>
							{isScoreReady && (
								<>
									<InfoRow>
										<B>
											{formatMessage({
												id: 'label.your_passport_score',
											})}
										</B>
										<H3>
											{passportScore !== null
												? passportScore
												: '--'}
										</H3>
									</InfoRow>
									<InfoRow $gray>
										<P>
											{formatMessage({
												id: 'label.required_score',
											})}
										</P>
										<H3>
											{currentRound?.minimumPassportScore !==
											undefined
												? currentRound.minimumPassportScore
												: '--'}
										</H3>
									</InfoRow>
								</>
							)}
							<StyledPassportBannerWrapper
								$bgColor={
									PassportBannerData[qfEligibilityState].bg
								}
							>
								{PassportBannerData[qfEligibilityState].icon}
								<P>
									{formatMessage({
										id: PassportBannerData[
											qfEligibilityState
										].content,
									})}
									{currentRound &&
										(passportState ===
											EPassportState.NOT_CREATED ||
											qfEligibilityState ===
												EQFElegibilityState.RECHECK_ELIGIBILITY) && (
											<strong>
												{new Date(currentRound.endDate)
													.toLocaleString(
														locale || 'en-US',
														{
															day: 'numeric',
															month: 'short',
														},
													)
													.replace(/,/g, '')}
											</strong>
										)}
								</P>
							</StyledPassportBannerWrapper>
						</InfoBox>
					</StyledCol>
				</Row>
				<HowBox>
					<HowTitle weight={700}>
						{formatMessage({
							id: 'label.how_it_works?',
						})}
					</HowTitle>
					<Lead>
						{formatMessage({
							id: 'page.passport.step1',
						})}
					</Lead>
					<Lead>
						{formatMessage({
							id: 'page.passport.step2',
						})}
					</Lead>
					<Lead>
						{formatMessage({
							id: 'page.passport.step3',
						})}
					</Lead>
				</HowBox>
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

const PassportRow = styled(FlexCenter)`
	margin-top: 24px;
	margin-bottom: 24px;
	gap: 24px;
`;

const PassportLink = styled(FlexCenter)`
	margin-top: 16px;
	margin-bottom: 60px;
	color: ${brandColors.giv[500]};
	gap: 4px;
`;

const StyledCol = styled(Col)`
	margin: auto;
`;

const InfoBox = styled(Flex)`
	flex-direction: column;
	gap: 11px;
	margin-top: 60px;
`;

interface IInfoRowProps {
	$gray?: boolean;
}

const InfoRow = styled(Flex)<IInfoRowProps>`
	justify-content: space-between;
	align-items: center;
	color: ${props => props.$gray && neutralColors.gray[700]};
`;

const HowBox = styled(Flex)`
	margin-top: 60px;
	flex-direction: column;
	gap: 24px;
	text-align: left;
`;

const HowTitle = styled(H5)`
	padding-bottom: 24px;
	border-bottom: 1px solid ${neutralColors.gray[400]};
`;

const StyledPassportBannerWrapper = styled(PassportBannerWrapper)`
	border-radius: 16px;
	height: auto;
`;
