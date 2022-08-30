import styled from 'styled-components';
import {
	neutralColors,
	IconShare,
	brandColors,
	IconHeartOutline,
	IconHeart,
} from '@giveth/ui-design-system';
import { Shadow } from '../styled-components/Shadow';
import { FlexCenter } from '@/components/styled-components/Flex';

const ShareLikeBadge = (props: {
	type: 'share' | 'like';
	active?: boolean;
	onClick: () => void;
}) => {
	const { type, active, onClick } = props;
	const isShare = type === 'share';
	const icon = isShare ? (
		<IconShare color={neutralColors.gray[500]} />
	) : active ? (
		<IconHeart color={brandColors.pinky[500]} />
	) : (
		<IconHeartOutline color={neutralColors.gray[500]} />
	);

	return <Wrapper onClick={onClick}>{icon}</Wrapper>;
};

const Wrapper = styled(FlexCenter)`
	height: 48px;
	width: 64px;
	display: flex;
	align-items: center;
	padding: 0 18px;
	background: white;
	border-radius: 48px;
	box-shadow: ${Shadow.Neutral[500]};
	cursor: pointer;
`;

export default ShareLikeBadge;
