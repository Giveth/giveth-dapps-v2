import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	Button,
	ButtonLink,
	ButtonText,
	H1,
	Lead,
	mediaQueries,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { Contract } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Col, Container, Row } from '@giveth/ui-design-system';
import { OvalVerticalGradient, OvalHorizontalGradient } from '../common.styles';
import { MintCard } from '@/components/cards/MintCard';
import config from '@/configuration';
import { abi as PFP_ABI } from '@/artifacts/pfpGiver.json';
import { GiversPFP } from '@/types/contracts';
import { EPFPMinSteps, usePFPMintData } from '@/context/pfpmint.context';
import { Flex } from '@/components/styled-components/Flex';

export const NFTMintIndex = () => {
	// const [showEligibilityModal, setShowEligibilityModal] = useState(false);
	const { formatMessage } = useIntl();
	const { account, library, chainId } = useWeb3React();
	const { step, setStep, qty, tx: txHash, setIsEligible } = usePFPMintData();

	useEffect(() => {
		const checkAddress = async () => {
			if (!library || !account) return;
			try {
				const _provider =
					chainId === config.MAINNET_NETWORK_NUMBER
						? library
						: new JsonRpcProvider(config.MAINNET_CONFIG.nodeUrl);
				const PFPContract = new Contract(
					config.MAINNET_CONFIG.PFP_CONTRACT_ADDRESS ?? '',
					PFP_ABI,
					_provider,
				) as GiversPFP;
				// const _allowListOnly = await PFPContract.allowListOnly();
				// if (_allowListOnly) {
				// 	const res = await PFPContract.allowList(account);
				// 	if (!res) {
				// 		setShowEligibilityModal(true);
				// 	} else {
				// 		setIsEligible(true);
				// 	}
				// } else {
				// 	setIsEligible(true);
				// }
			} catch (error) {
				console.log('Error on check allow List', error);
			}
		};
		checkAddress();
	}, [account, chainId, library]);

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
									<a
										href={config.OPENSEA_ADDRESS + account}
										target='_blank'
										rel='noreferrer'
									>
										<OpenSeaLink>
											View on OPENSEA
										</OpenSeaLink>
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
										href={`${config.MAINNET_CONFIG.blockExplorerUrls}/tx/${txHash}`}
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
	padding-top: 200px;
	position: relative;
`;

const Title = styled(H1)`
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

const OpenSeaLink = styled(ButtonText)`
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
