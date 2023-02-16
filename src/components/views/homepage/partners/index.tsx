import { B, Container, H3, neutralColors } from '@giveth/ui-design-system';
import Image from 'next/image';
import styled from 'styled-components';
import { PartnershipArray } from '@/content/Partnerships';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';

const OneHive = PartnershipArray.find(item => item.title.includes('1Hive'));
const Gnosis = PartnershipArray.find(item => item.title.includes('Gnosis'));
const CommonsStack = PartnershipArray.find(item =>
	item.title.includes('Commons Stack'),
);
const Gitcoin = PartnershipArray.find(item => item.title.includes('Gitcoin'));
const ShapeShift = PartnershipArray.find(item =>
	item.title.includes('ShapeShift'),
);

const PartnersArray = [OneHive, Gnosis, CommonsStack, Gitcoin, ShapeShift];

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
