import styled from 'styled-components';

import { HomeContainer } from '@/components/views/homepage/Home.sc';
import { mediaQueries } from '@/lib/constants/constants';
import { Shadow } from '@/components/styled-components/Shadow';
import Link from 'next/link';

const HomePurpleSection = () => {
	return (
		<Link href='/givpower'>
			<Wrapper />
		</Link>
	);
};

const Wrapper = styled(HomeContainer)`
	cursor: pointer;
	min-height: 200px;
	margin: 0 32px 64px 32px;
	border-radius: 12px;
	background: white;
	padding-top: 90px;
	position: relative;
	z-index: 2;
	overflow: hidden;
	box-shadow: ${Shadow.Neutral[400]};
	top: -50px;
	::after {
		background-image: url('/images/backgrounds/GIVPowerIsComing.png');
		background-position: center;
		content: '';
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		position: absolute;
		z-index: -1;
		width: 100%;
		background-size: cover;
	}

	${mediaQueries.tablet} {
		min-height: 450px;
		::after {
			background-size: cover;
		}
	}
`;

export default HomePurpleSection;
