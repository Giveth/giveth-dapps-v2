import React, { FC } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	GLink,
	IconExternalLink,
	H4,
	Lead,
	IconSpark,
	Button,
} from '@giveth/ui-design-system';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { mediaQueries } from '@/lib/constants/constants';
import routes from '@/lib/constants/Routes';
import { useDonateData } from '@/context/donate.context';
import Routes from '@/lib/constants/Routes';

const PurchaseXDAI: FC = () => {
	const { project } = useDonateData();
	const router = useRouter();
	const { formatMessage } = useIntl();

	const { query } = router;

	return (
		<Container>
			<BgImage />
			<Content>
				<Title>
					{formatMessage({ id: 'label.donate_with_dollars' })}{' '}
					<IconSpark size={32} color={brandColors.giv[500]} />
				</Title>
				<Lead>
					{formatMessage({
						id: 'label.use_your_bank_account_or_credit_card_to_send_crypto_to_your_wallet',
					})}
					<InfoHowToBuy
						as='a'
						rel='noopener noreferrer'
						target='_blank'
						href={`${routes.HowToBuyXdai}?slug=${query.slug}`}
					>
						<span>
							{formatMessage({ id: 'label.see_how_it_works' })}{' '}
						</span>
						<IconExternalLink
							size={16}
							color={brandColors.pinky[500]}
						/>
					</InfoHowToBuy>
				</Lead>
			</Content>
			<BuyButton
				label={formatMessage({ id: 'label.get_crypto' })}
				onClick={() =>
					router.push({
						pathname: Routes.PurchaseXdai,
					})
				}
			/>
		</Container>
	);
};

const Title = styled(H4)`
	color: ${brandColors.giv[500]};
	font-weight: 700;
`;

const Container = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100%;
	align-items: flex-start;
	justify-content: space-between;
	background: white;
	box-shadow: 0 3px 20px rgba(212, 218, 238, 0.4);
	border-radius: 16px;
	margin: 16px 0;
	padding: 32px 0;
	${mediaQueries.tablet} {
		height: 180px;
		flex-direction: row;
		margin: 0 40px 16px 40px;
		align-items: center;
	}
`;

const Content = styled.div`
	z-index: 2;
	min-width: 80%;
	text-align: left;
	padding: 24px 64px 24px 32px;
	word-wrap: break-word;
`;

const BgImage = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	background-image: url('/images/backgrounds/GIVGIVGIV.png');
	opacity: 0.1;
`;

const InfoHowToBuy = styled(GLink)`
	padding-left: 10px;
	color: ${brandColors.pinky[500]};
`;

const BuyButton = styled(Button)`
	z-index: 2;
	margin: 0 30px;
`;

export default PurchaseXDAI;
