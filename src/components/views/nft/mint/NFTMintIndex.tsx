import React from 'react';
import styled from 'styled-components';
import { brandColors, H1, Lead } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
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
				<Row>
					<Col xs={12} md={6}>
						<Title>
							{formatMessage({ id: 'label.mint_your_giver' })}
						</Title>
						<Desc>
							{formatMessage({
								id: 'page.mint.mint_your_giver.desc',
							})}
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
	margin-bottom: 32px;
`;
