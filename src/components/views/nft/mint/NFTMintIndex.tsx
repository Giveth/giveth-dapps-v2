import React from 'react';
import styled from 'styled-components';
import {
	brandColors,
	Button,
	ButtonLink,
	ButtonText,
	D3,
	Lead,
	mediaQueries,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { useWeb3React } from '@web3-react/core';
import { Col, Container, Row } from '@giveth/ui-design-system';
import { useRouter } from 'next/router';
import { OvalVerticalGradient, OvalHorizontalGradient } from '../common.styles';
import { MintCard } from '@/components/cards/MintCard';
import config from '@/configuration';
import { EPFPMinSteps, usePFPMintData } from '@/context/pfpmint.context';
import { Flex } from '@/components/styled-components/Flex';
import { useAppSelector } from '@/features/hooks';
import Routes from '@/lib/constants/Routes';
import { useModalCallback } from '@/hooks/useModalCallback';
import { isUserRegistered } from '@/lib/helpers';

export const NFTMintIndex = () => {
	// const [showEligibilityModal, setShowEligibilityModal] = useState(false);
	const { formatMessage } = useIntl();
	const { account } = useWeb3React();
	const { step, setStep, qty, tx: txHash } = usePFPMintData();
	const { isSignedIn, userData } = useAppSelector(state => state.user);
	const router = useRouter();

	const redirectAndOpenPFPModal = () => {
		if (isUserRegistered(userData)) {
			router.push(Routes.MyAccountSetPfp);
		} else {
			router.push(Routes.Onboard);
		}
	};

	const { modalCallback: signInThenRedirect } = useModalCallback(
		redirectAndOpenPFPModal,
	);

	const handleSetPFP = () => {
		if (isSignedIn) {
			redirectAndOpenPFPModal();
		} else {
			signInThenRedirect();
		}
	};

	return (
		<MintViewContainer>
			<OvalVerticalGradient />
			<StyledOvalHorizontalGradient />
			<MintContainer>
				<Row style={{ paddingBottom: '20px' }}>
					<Col xs={12} sm={8} md={6}>
						{step === EPFPMinSteps.MINT ? (
							<>
								<Title>
									{formatMessage({
										id: 'label.mint_your_giver',
									})}
								</Title>
								<ContentWrapper>
									<DescMint size='medium'>
										{formatMessage({
											id: 'page.mint.mint_your_giver.desc',
										})}
									</DescMint>
									<MintCard />
								</ContentWrapper>
							</>
						) : step === EPFPMinSteps.SUCCESS ? (
							<>
								<TitleCenter>
									{formatMessage({
										id: 'label.welcome_giver',
									})}
								</TitleCenter>
								<ContentWrapperCenter>
									<DescCenter>
										{formatMessage(
											{
												id: 'page.mint.welcome_giver.desc',
											},
											{
												itemCount: qty,
											},
										)}
									</DescCenter>
									<Button
										label={formatMessage({
											id: 'label.use_as_profile_picture',
										})}
										buttonType='primary'
										onClick={handleSetPFP}
									/>
									<a
										href={
											config.RARIBLE_ADDRESS +
											'user/' +
											account +
											'/owned'
										}
										target='_blank'
										rel='noreferrer'
									>
										<RaribleLink>
											View on Rarible
										</RaribleLink>
									</a>
									<Image
										src='/images/yellow_flower_full.svg'
										alt='yellow flower'
										width={320}
										height={320}
									/>
								</ContentWrapperCenter>
							</>
						) : (
							<>
								<TitleCenter>
									{formatMessage({
										id: 'label.uh_oh',
									})}
								</TitleCenter>
								<ContentWrapperCenter>
									<DescCenter>
										{formatMessage({
											id: 'page.mint.fail.desc',
										})}
									</DescCenter>
									<ButtonLink
										linkType='texty'
										label='View transaction on etherscan'
										href={`${config.MAINNET_CONFIG.blockExplorerUrls}tx/${txHash}`}
									/>
									<MintAgainButton
										label={formatMessage({
											id: 'label.mint_again',
										})}
										buttonType='primary'
										size='large'
										onClick={() =>
											setStep(EPFPMinSteps.MINT)
										}
									/>
									<Image
										src='/images/yellow_flower_full.svg'
										alt='yellow flower'
										width={320}
										height={320}
										style={{
											margin: 'auto',
											display: 'block',
										}}
									/>
								</ContentWrapperCenter>
							</>
						)}
					</Col>
					<Col xs={12} sm={4} md={6}>
						<ImagesWrapper>
							<Image1>
								<Image
									src='/images/nft/pfp-mint.png'
									alt='nft'
									fill
								/>
							</Image1>
							<Image2>
								<Image
									src='/images/nft/pfp-mint.png'
									alt='nft'
									fill
								/>
							</Image2>
						</ImagesWrapper>
					</Col>
				</Row>
			</MintContainer>
			{/* {showEligibilityModal && (
				<EligibilityModal
					isSuccess={false}
					setShowModal={setShowEligibilityModal}
				/>
			)} */}
		</MintViewContainer>
	);
};

const MintViewContainer = styled.div`
	min-height: 100vh;
	position: relative;
	overflow-x: hidden;
`;

const MintContainer = styled(Container)`
	padding-top: 100px;
	position: relative;
`;

const Title = styled(D3)`
	font-weight: 700;
	color: ${brandColors.deep[100]};
	margin-bottom: 22px;
`;

const TitleCenter = styled(Title)`
	text-align: center;
`;

const ContentWrapper = styled(Flex)`
	flex-direction: column;
	gap: 21px;
	position: relative;
	z-index: 2;
`;

const ContentWrapperCenter = styled(ContentWrapper)`
	align-items: center;
`;

const Desc = styled(Lead)`
	margin-bottom: 32px;
	width: 100%;
`;

const DescMint = styled(Desc)`
	${mediaQueries.laptopS} {
		max-width: 370px;
	}
	${mediaQueries.laptopL} {
		max-width: unset;
	}
`;

const DescCenter = styled(Desc)`
	text-align: center;
`;

const RaribleLink = styled(ButtonText)`
	color: ${brandColors.deep[100]};
	margin-bottom: 32px;
	display: block;
	text-align: center;
`;

const MintAgainButton = styled(Button)`
	width: 251px;
	margin: 16px auto 48px;
`;

const ImagesWrapper = styled.div`
	position: relative;
`;

const ImageWrapper = styled.div`
	position: absolute;
	right: 0;
	width: 100%;
	& > img {
		object-fit: contain;
		height: unset !important;
	}
	${mediaQueries.tablet} {
		width: 400px;
		height: 400px;
	}
`;

const Image1 = styled(ImageWrapper)`
	z-index: 2;
	display: none;
	${mediaQueries.tablet} {
	}
	${mediaQueries.laptopS} {
		display: block;
	}
`;

const Image2 = styled(ImageWrapper)`
	z-index: 1;
	position: absolute;
	right: 92px;
	top: 200px;
	opacity: 0.6;
	display: none;
	${mediaQueries.tablet} {
		display: block;
		right: -100px;
		top: 370px;
	}
	${mediaQueries.laptopS} {
		right: 92px;
		top: 200px;
	}
`;

const StyledOvalHorizontalGradient = styled(OvalHorizontalGradient)`
	display: none;
	${mediaQueries.tablet} {
		display: block;
	}
`;
