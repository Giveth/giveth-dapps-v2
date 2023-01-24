import Link from 'next/link';
import styled from 'styled-components';
import Image from 'next/image';
import {
	D1,
	H2,
	H4,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import { Shadow } from '@/components/styled-components/Shadow';
import givpowerIsHere from '../../../../public/images/backgrounds/givpower.png';
import wave from '../../../../public/images/wave.svg';
import { FlexCenter } from '@/components/styled-components/Flex';
import { HomeContainer } from './Home.sc';

const HomePurpleSection = () => {
	return (
		<Wrapper>
			<Link href='/givpower'>
				<Image
					alt='GIVpower is here'
					src={givpowerIsHere}
					fill
					style={{ objectFit: 'cover' }}
				/>
				<Content>
					<Title>GIVpower</Title>
					<Subtitle>
						<Image src={wave} height={30} width={148} alt='wave' />
						<H2>is here</H2>
					</Subtitle>
					<Desc weight={700}>
						Earn rewards while boosting projects to new heights
					</Desc>
				</Content>
			</Link>
		</Wrapper>
	);
};

const Wrapper = styled(HomeContainer)`
	position: relative;
	cursor: pointer;
	min-height: 550px;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: ${Shadow.Neutral[400]};
	display: flex;
	overflow: hidden;
	flex-direction: column;
	align-items: center;
	margin: 0 32px 64px 32px;
	padding-top: 70px;
`;
const Content = styled(FlexCenter)`
	position: relative;
	flex-direction: column;
`;

const Title = styled(D1)`
	z-index: 2;
	color: ${neutralColors.gray['100']};
`;

const Subtitle = styled(FlexCenter)`
	z-index: 1;
	color: ${semanticColors.golden[500]};
	margin: 8px 0;
	gap: 8px;
`;

const Desc = styled(H4)`
	z-index: 1;
	color: ${neutralColors.gray['100']};
	padding: 0 16px;
	max-width: 520px;
	text-align: center;
`;

export default HomePurpleSection;
