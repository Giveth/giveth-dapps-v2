import { useEffect } from 'react';
import styled from 'styled-components';
import { FlexCenter, IconArrowRight16 } from '@giveth/ui-design-system';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import Routes from '@/lib/constants/Routes';
import { useAppSelector } from '@/features/hooks';
import { getNowUnixMS } from '@/helpers/time';
import { thousandsSeparator } from '@/lib/helpers';

interface IQFAnnouncementBannerProps {
	onShow?: (isShowing: boolean) => void;
}

const QFAnnouncementBanner = ({ onShow }: IQFAnnouncementBannerProps) => {
	const { formatMessage } = useIntl();
	const router = useRouter();
	const shouldShowBanner =
		router.pathname === Routes.Home ||
		router.pathname === Routes.AllProjects ||
		router.pathname === '/projects/[slug]' ||
		router.pathname === Routes.Projects ||
		router.pathname === Routes.Project ||
		router.pathname === '/project/[projectIdSlug]' ||
		router.pathname === Routes.MyAccount ||
		router.pathname === Routes.QFArchived;

	const { activeQFRound } = useAppSelector((state: any) => state.general);

	const isRoundActive =
		activeQFRound &&
		(() => {
			const now = getNowUnixMS();
			const startTime = new Date(activeQFRound.beginDate).getTime();
			const endTime = new Date(activeQFRound.endDate).getTime();
			return now >= startTime && now <= endTime;
		})();

	useEffect(() => {
		onShow?.(shouldShowBanner && isRoundActive);
	}, [shouldShowBanner, isRoundActive, onShow]);

	if (!shouldShowBanner || !isRoundActive) return null;

	const {
		allocatedFundUSD,
		allocatedFundUSDPreferred,
		allocatedTokenSymbol,
		allocatedFund,
	} = activeQFRound || {};

	return (
		<Wrapper>
			<LinkWrapper href={Routes.AllQFProjects}>
				<PStyled>
					💜 <span>{activeQFRound.name}</span>{' '}
					{formatMessage(
						{ id: 'label.donations_amplified' },
						{
							amount: allocatedFundUSDPreferred
								? '$' + thousandsSeparator(allocatedFundUSD)
								: thousandsSeparator(allocatedFund) +
										' ' +
										allocatedTokenSymbol || ' --',
						},
					)}{' '}
					<IconArrowRight16 size={20} color='#FF96C6' />
				</PStyled>
			</LinkWrapper>
		</Wrapper>
	);
};

const PStyled = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
	font-weight: 600;
	font-size: 14px;
	color: #ff96c6;
	& span {
		display: inline-block;
		margin-right: 15px;
		font-weight: 400;
		font-size: 16px;
		background: linear-gradient(98.69deg, #ffadd3 35.01%, #754dff 113.37%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-fill-color: transparent;
	}
	@media (max-width: 768px) {
		flex-direction: column;
	}
`;

const LinkWrapper = styled(Link)`
	display: flex;
	align-items: center;
	text-align: center;
	justify-content: center;
	gap: 4px;
	width: 100%;
`;

const Wrapper = styled(FlexCenter)`
	width: 100%;
	flex-wrap: wrap;
	padding: 16px;
	text-align: center;
	background: url('/images/banners/qf-round/banner-bg.svg') no-repeat center
		center;
	background-size: cover;
	z-index: 99;
	position: sticky;
	cursor: pointer;
`;

export default QFAnnouncementBanner;
