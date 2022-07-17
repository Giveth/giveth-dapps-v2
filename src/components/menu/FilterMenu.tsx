import {
	B,
	ButtonText,
	GLink,
	IconArrowBottom,
	IconArrowTop,
	IconHeart16,
	IconHeartOutline16,
	IconX,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { mediaQueries } from '@/lib/constants/constants';
import { Flex } from '../styled-components/Flex';
import { ESortby, EDirection } from '@/apollo/types/gqlEnums';

export const FilterMenu = () => {
	return (
		<MenuContainer>
			<Header>
				<CloseContainer>
					<IconX size={24} />
				</CloseContainer>
				<Title size='medium'>Filters</Title>
			</Header>
			<Section>
				<B>Sort by</B>
				{sortByOptions.map((sortByOption, idx) => (
					<SortItem key={idx}>
						<GLink>{sortByOption.label}</GLink>
						<IconContainer>{sortByOption.icon}</IconContainer>
					</SortItem>
				))}
			</Section>
			<Section>
				<B>Project features</B>
			</Section>
		</MenuContainer>
	);
};

// should merge with sortByOptions in projectsIndex at the end
const sortByOptions = [
	{
		label: 'Newest',
		value: ESortby.CREATIONDATE,
		icon: <IconArrowTop size={16} />,
	},
	{
		label: 'Oldest',
		value: ESortby.CREATIONDATE,
		direction: EDirection.ASC,
		icon: <IconArrowBottom size={16} />,
	},
	{
		label: 'Most liked',
		value: ESortby.HEARTS,
		icon: <IconHeartOutline16 />,
	},
	{ label: 'Most funded', value: ESortby.DONATIONS, icon: <IconHeart16 /> },
];

const MenuContainer = styled.div`
	padding: 24px;
	background-color: ${neutralColors.gray[100]};
	box-shadow: 0px 3px 20px rgba(212, 218, 238, 0.7);
	border-radius: 16px;
	${mediaQueries.tablet} {
		width: 375px;
	}
`;

const Header = styled.div`
	position: relative;
	height: 24px;
	text-align: center;
`;

const CloseContainer = styled.div`
	width: 24px;
	height: 24px;
	position: absolute;
	left: 0;
	top: 0;
	cursor: pointer;
`;

const Title = styled(ButtonText)``;

const Section = styled.section`
	margin: 24px 0;
`;

const SortItem = styled(Flex)`
	margin: 16px 0;
	background-color: ${neutralColors.gray[300]};
	border-radius: 50px;
	padding: 10px 16px;
	gap: 10px;
`;

const IconContainer = styled.div`
	width: 16px;
	height: 22px;
	padding: 2px 0;
`;
