import React, { useEffect } from 'react';
import styled from 'styled-components';
import { brandColors, H1, Lead } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { Contract } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { JsonRpcProvider } from '@ethersproject/providers';
import { OvalVerticalGradient, OvalHorizontalGradient } from '../common.styles';
import { Col, Container, Row } from '@/components/Grid';
import { MintCard } from '@/components/cards/MintCard';
import config from '@/configuration';
import { abi as PFP_ABI } from '@/artifacts/pfpGiver.json';
import { GiversPFP } from '@/types/contracts';
import { EPFPMinSteps, usePFPMintData } from '@/context/pfpmint.context';

export const NFTMintIndex = () => {
	const { formatMessage } = useIntl();
	const { account, library, chainId } = useWeb3React();
	const { step } = usePFPMintData();

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
				const res = await PFPContract.allowList(account);
				console.log(res);
			} catch (error) {
				console.log('Error on check allow List', error);
			}
		};
		checkAddress();
	}, [account, chainId, library]);

	return (
		<MintViewContainer>
			<OvalVerticalGradient />
			<OvalHorizontalGradient />
			<MintContainer>
				<Row style={{ paddingBottom: '20px;' }}>
					<Col xs={12} md={6}>
						{step === EPFPMinSteps.MINT ? (
							<>
								<Title>
									{formatMessage({
										id: 'label.mint_your_giver',
									})}
								</Title>
								<ContentWrapper>
									<Desc>
										{formatMessage({
											id: 'page.mint.mint_your_giver.desc',
										})}
									</Desc>
									<MintCard />
								</ContentWrapper>
							</>
						) : step === EPFPMinSteps.SUCCESS ? (
							<>
								<Title>
									{formatMessage({
										id: 'label.welcome_giver',
									})}
								</Title>
								<ContentWrapper>
									<Desc>
										{formatMessage(
											{
												id: 'page.mint.welcome_giver.desc',
											},
											{
												itemCount: 5,
											},
										)}
									</Desc>
									<Image
										src='/images/yellow_flower_full.svg'
										alt='yellow flower'
										width={360}
										height={360}
									/>
								</ContentWrapper>
							</>
						) : (
							<>
								<Title>
									{formatMessage({
										id: 'label.welcome_giver',
									})}
								</Title>
								<ContentWrapper>
									<Desc>
										{formatMessage(
											{
												id: 'page.mint.welcome_giver.desc',
											},
											{
												itemCount: 5,
											},
										)}
									</Desc>
									<Image
										src='/images/yellow_flower_full.svg'
										alt='yellow flower'
										width={360}
										height={360}
									/>
								</ContentWrapper>
							</>
						)}
					</Col>
					<Col xs={12} md={6}>
						<ImageWrapper>
							<Image1
								src='/images/nft/pfp-mint.png'
								alt='nft'
								width={500}
								height={500}
							/>
							<Image2
								src='/images/nft/pfp-mint.png'
								alt='nft'
								width={500}
								height={500}
							/>
						</ImageWrapper>
					</Col>
				</Row>
			</MintContainer>
		</MintViewContainer>
	);
};

const MintViewContainer = styled.div`
	min-height: 100vh;
	position: relative;
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

const ContentWrapper = styled.div`
	width: 480px;
`;

const Desc = styled(Lead)`
	margin-bottom: 32px;
`;

const ImageWrapper = styled.div`
	position: relative;
	height: 1000px;
`;

const Image1 = styled(Image)`
	z-index: 2;
	position: relative;
`;

const Image2 = styled(Image)`
	z-index: 1;
	position: absolute;
	right: 250px;
	top: 250px;
	opacity: 0.6;
`;
