import { Container, H2, Row, H1 } from '@giveth/ui-design-system';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { BannerContainer, StyledColArch } from './common';
import { useProjectsContext } from '@/context/projects.context';
import useMediaQuery from '@/hooks/useMediaQuery';
import { deviceSize } from '@/lib/constants/constants';

type TImgDimensionsMap = {
	[key: number]: { desktop: number; tablet: number; gridColumns: number };
};

export const ArchivedQFProjectsBanner = () => {
	const { formatMessage } = useIntl();
	const { query } = useRouter();
	const { qfRounds } = useProjectsContext();
	const round = qfRounds.find(round => round.slug === query.slug);
	const sponsorsLength = round?.sponsorsImgs?.length ?? 0;
	const imgDimensionsMap: TImgDimensionsMap = {
		1: { desktop: 300, tablet: 260, gridColumns: 1 },
		2: { desktop: 200, tablet: 160, gridColumns: 2 },
		4: { desktop: 150, tablet: 110, gridColumns: 2 },
		5: { desktop: 120, tablet: 100, gridColumns: 3 },
		6: { desktop: 100, tablet: 80, gridColumns: 3 },
	};
	const islaptopS = useMediaQuery(`(max-width: ${deviceSize.laptopS - 1}px)`);

	const render3SponsorsGrid = () => {
		if (!round || !round.sponsorsImgs || round.sponsorsImgs.length !== 3) {
			return null;
		}

		const [sponsor1, sponsor2, sponsor3] = round.sponsorsImgs;

		return (
			<CardGrid>
				<TopLeftCard>
					<Image
						width={140}
						height={140}
						layout='fixed'
						objectFit='cover'
						src={sponsor1}
						alt='Sponsor 1'
					/>
				</TopLeftCard>
				<TopRightCard>
					<Image
						width={140}
						height={140}
						layout='fixed'
						objectFit='cover'
						src={sponsor2}
						alt='Sponsor 2'
					/>
				</TopRightCard>
				<BottomCenterCard>
					<Image
						width={140}
						height={140}
						layout='fixed'
						objectFit='cover'
						src={sponsor3}
						alt='Sponsor 3'
					/>
				</BottomCenterCard>
			</CardGrid>
		);
	};

	return (
		<BannerContainer>
			{round?.bannerBgImage && (
				<Image
					src={round?.bannerBgImage}
					style={{ objectFit: 'cover' }}
					fill
					alt='QF Banner'
				/>
			)}
			<ContentContainer>
				<BannnerTitleContainer>
					<Row>
						<StyledColArch
							xs={12}
							md={12}
							style={
								round && round.name
									? { flexDirection: 'column' }
									: { flexDirection: 'row' }
							}
						>
							<H1 weight={700}>
								{formatMessage({
									id: 'label.quadratic_funding',
								})}
							</H1>
							<H2>
								{round ? round.name : null}{' '}
								{islaptopS ? 'Tablet' : 'Desktop'}
							</H2>
						</StyledColArch>
					</Row>
				</BannnerTitleContainer>
				{sponsorsLength === 3 ? (
					render3SponsorsGrid()
				) : round && sponsorsLength > 0 ? (
					<SponsorsContainer
						style={{
							gridTemplateColumns: `repeat(${imgDimensionsMap[sponsorsLength].gridColumns}, 1fr)`,
						}}
					>
						{round.sponsorsImgs.map((sponsor, index) => (
							<SingleSponsorImgContainer
								key={`sponsor_${index + 1}`}
								style={{
									width:
										imgDimensionsMap[sponsorsLength][
											islaptopS ? 'tablet' : 'desktop'
										] + 'px',
									height:
										imgDimensionsMap[sponsorsLength][
											islaptopS ? 'tablet' : 'desktop'
										] + 'px',
								}}
							>
								<Image
									src={sponsor}
									alt={`Sponsor ${index}`}
									width={
										imgDimensionsMap[sponsorsLength][
											islaptopS ? 'tablet' : 'desktop'
										]
									}
									height={
										imgDimensionsMap[sponsorsLength][
											islaptopS ? 'tablet' : 'desktop'
										]
									}
									layout='fixed'
									objectFit='cover'
								/>
							</SingleSponsorImgContainer>
						))}
					</SponsorsContainer>
				) : null}
			</ContentContainer>
		</BannerContainer>
	);
};

const CardGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: auto auto;
	gap: 20px;
`;

const Card = styled.div`
	position: relative;
	background-color: #f0f0f0;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	height: 140px;
	width: 140px;
	border-radius: 20px;
	overflow: hidden;

	@media (max-width: 1024px) {
		width: 100px;
		height: 100px;
	}
`;

const TopLeftCard = styled(Card)`
	grid-column: 1 / span 1;
	grid-row: 1 / span 1;
`;

const TopRightCard = styled(Card)`
	grid-column: 2 / span 1;
	grid-row: 1 / span 1;
`;

const BottomCenterCard = styled(Card)`
	grid-column: 1 / span 2;
	grid-row: 2 / span 1;
	justify-self: center;
`;

const ContentContainer = styled(Container)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	z-index: 1;
	padding: 0 20px;

	@media (max-width: 1024px) {
		width: 90% !important;
	}
`;

const BannnerTitleContainer = styled.div`
	position: relative;
	z-index: 1;
`;

const SponsorsContainer = styled.div`
	display: grid;
	justify-content: center;
	align-items: center;
	grid-template-columns: repeat(3, 1fr);
	gap: 20px;

	@media (max-width: 1024px) {
		gap: 10px;
	}
`;

const SingleSponsorImgContainer = styled.div`
	position: relative;
	width: 140px;
	height: 140px;
	border-radius: 20px;
	overflow: hidden;

	@media (max-width: 1024px) {
		width: 100px;
		height: 100px;
	}
`;
