import { B, Container, H3, neutralColors } from '@giveth/ui-design-system';
import Image from 'next/image';
import styled from 'styled-components';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';
import The_Commons_Stack from '/public/images/partnerships/The_Commons_Stack.svg';
import Gitcoin from '/public/images/partnerships/Gitcoin.svg';
import ShapeShift_DAO from '/public/images/partnerships/ShapeShift_DAO.svg';
import OneHive from '/public/images/partnerships/1Hive.svg';
import Gnosis_Chain from '/public/images/partnerships/Gnosis_Chain.svg';

const PartnersArray = [
	{
		icon: OneHive,
		title: '1Hive',
		description: 'page.partnerships.1hive',
		link: 'https://about.1hive.org/',
	},
	{
		icon: Gnosis_Chain,
		title: 'Gnosis Chain',
		description: 'page.partnerships.gnosischain',
		link: 'https://xdaichain.com',
	},
	{
		icon: The_Commons_Stack,
		title: 'The Commons Stack',
		description: 'page.partnerships.thecommonsstack',
		link: 'https://commonsstack.org',
	},
	{
		icon: Gitcoin,
		title: 'Gitcoin',
		description: 'page.partnerships.gitcoin',
		link: 'https://gitcoin.co/',
	},
	{
		icon: ShapeShift_DAO,
		title: 'ShapeShift DAO',
		description: 'page.partnerships.shapeshiftdao',
		link: 'https://shapeshift.com/',
	},
];

const HomePartners = () => {
	return (
		<Wrapper>
			<Container>
				<FlexCenter direction='column' gap='60px'>
					<CustomHeading>Proud of our partners</CustomHeading>
					<CustomFlex justifyContent='space-around'>
						{PartnersArray.map(partner => (
							<FlexCenter
								direction='column'
								key={partner?.title}
								gap='8px'
							>
								<Image
									src={partner?.icon}
									width={90}
									height={90}
									alt={partner?.title ?? ''}
								/>
								<B>{partner?.title}</B>
							</FlexCenter>
						))}
					</CustomFlex>
				</FlexCenter>
			</Container>
		</Wrapper>
	);
};

const CustomHeading = styled(H3)`
	color: ${neutralColors.gray[500]};
`;

const Wrapper = styled.div`
	padding: 40px 0px;
`;

const CustomFlex = styled(Flex)`
	width: 100%;
	flex-wrap: wrap;
	flex-direction: column;
	gap: 40px;
	${mediaQueries.tablet} {
		flex-direction: row;
		gap: 100px;
	}
`;

export default HomePartners;
