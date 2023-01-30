import React from 'react';
import styled from 'styled-components';
import { brandColors, H1, Lead } from '@giveth/ui-design-system';
import { OvalVerticalGradient, OvalHorizontalGradient } from '../common.styles';
import { Col, Container, Row } from '@/components/Grid';
import { MintCard } from '@/components/cards/MintCard';

export const NFTMintIndex = () => {
	return (
		<MintViewContainer>
			<OvalVerticalGradient />
			<OvalHorizontalGradient />
			<MintContainer>
				<Row>
					<Col xs={12} md={6}>
						<Title>Mint your Giver</Title>
						<Desc>
							The Givers collection is available on Ethereum
							Mainnet and 1,150 of the total 1,250 Givers are
							available for public minting. Each Giver can be
							minted for 100 DAI each and funds raised will go
							towards supporting the Giveth DAO.
						</Desc>
						<MintCard />
					</Col>
					<Col xs={12} md={6}></Col>
				</Row>
			</MintContainer>
		</MintViewContainer>
	);
};

const MintViewContainer = styled.div`
	height: 100vh;
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

const Desc = styled(Lead)`
	margin-bottom: 22px;
`;
