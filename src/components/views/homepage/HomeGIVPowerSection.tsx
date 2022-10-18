import Link from 'next/link';
import styled from 'styled-components';
import Image from 'next/image';
import { HomeContainer } from '@/components/views/homepage/Home.sc';
import { mediaQueries } from '@/lib/constants/constants';
import { Shadow } from '@/components/styled-components/Shadow';
import givpowerIsHere from '../../../../public/images/backgrounds/givpowerishere.png';

const HomePurpleSection = () => {
	return (
		<Link href='/givpower'>
			<a>
				<Wrapper>
					<Image
						src={givpowerIsHere}
						layout='fill'
						objectFit='cover'
					/>
				</Wrapper>
			</a>
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

	${mediaQueries.tablet} {
		min-height: 550px;
	}
`;

export default HomePurpleSection;
