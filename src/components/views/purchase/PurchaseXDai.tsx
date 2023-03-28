import React, { FC } from 'react';
import { H3, P, neutralColors, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { BigArc } from '@/components/styled-components/Arc';
import { mediaQueries } from '@/lib/constants/constants';
import MtpelerinBanner from './MtpelerinBanner';
import useDetectDevice from '@/hooks/useDetectDevice';

const PurchaseXDai: FC = () => {
	const { isMobile } = useDetectDevice();
	const { formatMessage, locale } = useIntl();
	return (
		<>
			<BigArc />
			<Wrapper>
				<MtpelerinBanner />
				<Sections>
					<Left>
						<Title>
							{formatMessage({
								id: 'label.crypto_made_easy',
							})}
						</Title>
						<Desc>
							{formatMessage({
								id: 'label.thanks_to_mtpelerin_you_can_onramp_your_dollars',
							})}
						</Desc>
						<Info>
							<P>
								&bull;{' '}
								{formatMessage({
									id: 'label.purchase_with_credit_debit',
								})}
							</P>
							<P>
								&bull;{' '}
								{formatMessage({
									id: 'label.the_funds_are_sent_to_your_wallet_within_minutes',
								})}
							</P>
							<P>
								&bull;
								{formatMessage({
									id: 'label.the_service_is_a_kycfree_authorized_financial_intermediary',
								})}
							</P>
						</Info>
						<PwdMtPelerin>
							Powered By <img src='/images/mtpelerin.svg' />
						</PwdMtPelerin>
					</Left>
					<Right>
						<MtPelerinIFrame
							allow='usb'
							src={`https://widget.mtpelerin.com/?lang=${
								locale || 'en'
							}&bsc=USD&tabs=buy&crys=XDAI&bdc=XDAI&net=xdai_mainnet`}
						></MtPelerinIFrame>
					</Right>
				</Sections>
			</Wrapper>
		</>
	);
};

const Wrapper = styled.div`
	max-width: 1052px;
	text-align: center;
	padding: 137px 0;
	margin: 0 auto;
	position: relative;
`;

const Sections = styled.div`
	height: 100%;
	${mediaQueries.tablet} {
		display: grid;
		grid-template-columns: repeat(2, minmax(500px, 1fr));
		grid-auto-rows: minmax(100px, auto);
	}
	${mediaQueries.mobileL} {
		grid-template-columns: repeat(2, minmax(100px, 1fr));
		padding: 0 40px;
	}
`;

const Right = styled.div`
	z-index: 1;
	background: transparent;
	text-align: left;
	min-height: 450px;
	padding: 12px;
	border-radius: 16px;
	${mediaQueries.tablet} {
		min-height: 620px;
		background: white;
		border-radius: 0 16px 16px 0;
	}
`;

const Left = styled(Right)`
	border-radius: 0;
	margin: 0 0 40px 0;
	padding: 32px;

	${mediaQueries.tablet} {
		margin: 0 21px 0 0;
	}
`;

const Desc = styled(P)`
	margin: 20px 0 0 0;
`;

const Info = styled.div`
	padding: 20px 0 30px 0;
	border-bottom: 1px solid rgba(51, 51, 51, 0.35);
	* {
		padding: 0 20px;
		font-weight: bold;
	}
`;

const Title = styled(H3)`
	font-weight: 700;
	font-size: 41px;
	line-height: 56px;
	color: ${brandColors.giv[500]};
`;

const PwdMtPelerin = styled.div`
	display: flex;
	margin: 30px 0 0 0;
	align-items: center;
	gap: 10px;
	font-weight: 400;
	font-size: 19.3613px;
	line-height: 150%;
	color: ${neutralColors.gray[800]} !important;
`;

const MtPelerinIFrame = styled.iframe`
	width: 100%;
	min-height: 400px;
	border: none;
	${mediaQueries.tablet} {
		height: 100%;
	}
`;

export default PurchaseXDai;
