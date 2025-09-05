// src/components/views/qfrounds/QFRoundsIndex.tsx

import {
	Container,
	FlexCenter,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useQFRoundsContext } from '@/context/qfrounds.context';
import { PassportBanner } from '@/components/PassportBanner';
import { Spinner } from '@/components/Spinner';
import { QFRoundsBanner } from '@/components/views/qfrounds/QFRoundsBanner';
import QFRoundCard from '@/components/views/qfrounds/QFRoundCard';

const QFRoundsIndex = () => {
	const { qfRounds, loading } = useQFRoundsContext();
	const { formatMessage } = useIntl();
	return (
		<>
			{loading && (
				<Loading>
					<Spinner />
				</Loading>
			)}
			<PassportBanner />
			<Wrapper>
				<QFRoundsBanner />
				<Title>{formatMessage({ id: 'label.qf.active_rounds' })}</Title>
				<QFRoundsWrapper>
					<QFRoundCard
						layout='horizontal'
						title='Future of Finance Round'
						description='Support climate and sustainability projects building a greener future. By funding clean energy, reforestation, and conservation, your donation helps scale real solutions to the climate crisis. Even small contributions unlock big matching funds for lasting environmental impact.'
						imageUrl='/images/banners/GIVGIVGIV-purple.png'
						matchingPoolUsd={50000}
						startDate='March 18'
						endDate='April 1, 2025'
						onExplore={() => console.log('/qf/future-of-finance')}
					/>
					<QFRoundCard
						layout='horizontal'
						title='Future of Finance Round'
						description='Support climate and sustainability projects building a greener future. By funding clean energy, reforestation, and conservation, your donation helps scale real solutions to the climate crisis. Even small contributions unlock big matching funds for lasting environmental impact.'
						imageUrl='/images/banners/GIVGIVGIV-purple.png'
						matchingPoolUsd={50000}
						startDate='March 18'
						endDate='April 1, 2025'
						onExplore={() => console.log('/qf/future-of-finance')}
					/>

					<QFRoundCard
						layout='grid'
						title='ENS x Octant Round'
						description='Support climate and sustainability projects building a greener future. By funding clean energy, reforestation, and conservation, your donation helps scale real solutions to the climate crisis. Even small contributions unlock big matching funds for lasting environmental impact.'
						imageUrl='/images/banners/GIVGIVGIV-purple.png'
						matchingPoolUsd={50000}
						startDate='March 18'
						endDate='April 1, 2025'
						onExplore={() => console.log('/qf/ens-octant')}
					/>
					<QFRoundCard
						layout='grid'
						title='ENS x Octant Round'
						description='Support climate and sustainability projects building a greener future. By funding clean energy, reforestation, and conservation, your donation helps scale real solutions to the climate crisis. Even small contributions unlock big matching funds for lasting environmental impact.'
						imageUrl='/images/banners/GIVGIVGIV-purple.png'
						matchingPoolUsd={50000}
						startDate='March 18'
						endDate='April 1, 2025'
						onExplore={() => console.log('/qf/ens-octant')}
					/>
					<QFRoundCard
						layout='grid'
						title='ENS x Octant Round'
						description='Support climate and sustainability projects building a greener future. By funding clean energy, reforestation, and conservation, your donation helps scale real solutions to the climate crisis. Even small contributions unlock big matching funds for lasting environmental impact.'
						imageUrl='/images/banners/GIVGIVGIV-purple.png'
						matchingPoolUsd={50000}
						startDate='March 18'
						endDate='April 1, 2025'
						onExplore={() => console.log('/qf/ens-octant')}
					/>
					<QFRoundCard
						layout='grid'
						title='ENS x Octant Round'
						description='Support climate and sustainability projects building a greener future. By funding clean energy, reforestation, and conservation, your donation helps scale real solutions to the climate crisis. Even small contributions unlock big matching funds for lasting environmental impact.'
						imageUrl='/images/banners/GIVGIVGIV-purple.png'
						matchingPoolUsd={50000}
						startDate='March 18'
						endDate='April 1, 2025'
						onExplore={() => console.log('/qf/ens-octant')}
					/>
					<QFRoundCard
						layout='grid'
						title='ENS x Octant Round'
						description='Support climate and sustainability projects building a greener future. By funding clean energy, reforestation, and conservation, your donation helps scale real solutions to the climate crisis. Even small contributions unlock big matching funds for lasting environmental impact.'
						imageUrl='/images/banners/GIVGIVGIV-purple.png'
						matchingPoolUsd={50000}
						startDate='March 18'
						endDate='April 1, 2025'
						onExplore={() => console.log('/qf/ens-octant')}
					/>
					<QFRoundCard
						layout='grid'
						title='ENS x Octant Round'
						description='Support climate and sustainability projects building a greener future. By funding clean energy, reforestation, and conservation, your donation helps scale real solutions to the climate crisis. Even small contributions unlock big matching funds for lasting environmental impact.'
						imageUrl='/images/banners/GIVGIVGIV-purple.png'
						matchingPoolUsd={50000}
						startDate='March 18'
						endDate='April 1, 2025'
						onExplore={() => console.log('/qf/ens-octant')}
					/>
				</QFRoundsWrapper>
			</Wrapper>
		</>
	);
};

const Loading = styled(FlexCenter)`
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
	height: 100%;
	width: 100%;
	background-color: gray;
	transition: opacity 0.3s ease-in-out;
	opacity: 0.9;
`;

const Wrapper = styled(Container)`
	${mediaQueries.tablet} {
		padding-top: 33px;
		padding-bottom: 33px;
	}
	${mediaQueries.laptopS} {
		padding-top: 40px;
		padding-bottom: 40px;
	}
`;

const Title = styled.h1`
	margin-top: 32px;
	font-size: 25px;
	font-weight: 700;
	color: ${neutralColors.gray[900]};
`;

const QFRoundsWrapper = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 32px;
	margin-top: 32px;
`;

export default QFRoundsIndex;
