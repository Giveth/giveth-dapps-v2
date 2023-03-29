import React, { FC } from 'react';
import styled from 'styled-components';
import { brandColors, H4, Lead } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { mediaQueries } from '@/lib/constants/constants';

const MtpelerinBanner: FC = () => {
	const { formatMessage } = useIntl();

	return (
		<Container>
			<Content>
				<Title>
					{formatMessage({ id: 'label.get_crypto_with_mtpelerin' })}
				</Title>
				<Lead>
					{formatMessage({
						id: 'label.use_a_bank_transfer_or_credit_Card',
					})}
				</Lead>
			</Content>
			<BgImage />
		</Container>
	);
};

const Title = styled(H4)`
	color: ${brandColors.giv[500]};
	font-weight: 700;
`;

const Container = styled.div`
	display: flex;
	height: 200px;
	align-items: center;
	background: white !important;
	box-shadow: 0 3px 20px rgba(212, 218, 238, 0.4);
	border-radius: 16px;
	margin: 40px 0;

	${mediaQueries.tablet} {
		height: 127px;
		margin: 0 40px 16px 40px;
	}
`;

const Content = styled.div`
	background: white !important;
	position: absolute;
	text-align: left;
	z-index: 2;
	padding: 24px 64px 24px 32px;
	word-wrap: break-word;
`;

const BgImage = styled.div`
	width: 100%;
	height: 100%;
	background-image: white;
	opacity: 0.1;
`;

export default MtpelerinBanner;
