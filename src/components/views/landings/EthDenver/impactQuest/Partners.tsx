import styled from 'styled-components';
import { B, H3, neutralColors } from '@giveth/ui-design-system';
import Hedera from '/public/images/icons/impactQuests/hedera.png';
import Keepkey from '/public/images/icons/impactQuests/keepkey.png';
import WorkDAO from '/public/images/icons/impactQuests/workdao.png';
import PizzaDao from '/public/images/icons/impactQuests/pizza-dao.png';
import OneInch from '/public/images/icons/impactQuests/1inch.svg';
import Consensys from '/public/images/icons/impactQuests/Consensys.svg';
import DogeClaren from '/public/images/icons/impactQuests/dogeClaren.png';
import ETHDenver from '/public/images/icons/impactQuests/ETHDenver.png';
import Image from 'next/image';
import { FlexCenter } from '@/components/styled-components/Flex';

const Partners = () => {
	return (
		<Wrapper>
			<H3 weight={700}>Impact Quests Partners</H3>
			<PartnersWrapper>
				{partnersArray.map(partner => (
					<PartnerItem key={partner.name} {...partner} />
				))}
			</PartnersWrapper>
		</Wrapper>
	);
};

const PartnerItem = ({ name, image }: { name: string; image: string }) => {
	return (
		<FlexCenter direction='column' gap='16px'>
			<Image src={image} alt={name} />
			<B>{name}</B>
		</FlexCenter>
	);
};

const partnersArray = [
	{
		name: 'Hedera',
		image: Hedera,
	},
	{
		name: 'Keepkey',
		image: Keepkey,
	},
	{
		name: 'Work DAO',
		image: WorkDAO,
	},
	{
		name: 'Pizza DAO',
		image: PizzaDao,
	},
	{
		name: 'ETHDenver',
		image: ETHDenver,
	},
	{
		name: '1inch',
		image: OneInch,
	},
	{
		name: 'Consensys',
		image: Consensys,
	},
	{
		name: 'DogeClaren',
		image: DogeClaren,
	},
];

const PartnersWrapper = styled.div`
	margin-top: 60px;
	display: flex;
	gap: 104px;
	flex-wrap: wrap;
	justify-content: center;
`;

const Wrapper = styled.div`
	padding: 40px;
	> h3 {
		text-align: center;
		color: ${neutralColors.gray[500]};
	}
`;

export default Partners;
