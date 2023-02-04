import React from 'react';
import styled from 'styled-components';
import { brandColors, H1, Lead } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { OvalVerticalGradient, OvalHorizontalGradient } from '../common.styles';
import { Col, Container, Row } from '@/components/Grid';
import { MintCard } from '@/components/cards/MintCard';

export const NFTMintIndex = () => {
	const { formatMessage } = useIntl();

	return (
		<MintViewContainer>
			<OvalVerticalGradient />
			<OvalHorizontalGradient />
			<MintContainer>
				<Row style={{ paddingBottom: '20px;' }}>
					<Col xs={12} md={6}>
						<Title>
							{formatMessage({ id: 'label.mint_your_giver' })}
						</Title>
						<ContentWrapper>
							<Desc>
								{formatMessage({
									id: 'page.mint.mint_your_giver.desc',
								})}
							</Desc>
							<MintCard />
						</ContentWrapper>
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
