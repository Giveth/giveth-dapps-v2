import styled from 'styled-components';
import {
	neutralColors,
	IconShare,
	brandColors,
	IconHeartOutline,
	ButtonText,
	IconHeartFilled,
} from '@giveth/ui-design-system';
import { Shadow } from '../styled-components/Shadow';
import { FlexCenter } from '@/components/styled-components/Flex';

const ShareLikeBadge = (props: {
	type: 'share' | 'like';
	active?: boolean;
	onClick: () => void;
	isSimple?: boolean;
}) => {
	const { type, active, onClick, isSimple } = props;
	const isShare = type === 'share';
	const text = isShare ? 'Share' : 'Like';
	const icon = isShare ? (
		<IconShare color={neutralColors.gray[500]} />
	) : active ? (
		<IconHeartFilled color={brandColors.pinky[500]} />
	) : (
		<IconHeartOutline color={neutralColors.gray[500]} />
	);

	return (
		<Wrapper isSimple={isSimple} onClick={onClick}>
			{icon}
			{!isSimple && <BadgeText size='small'>{text}</BadgeText>}
		</Wrapper>
	);
};

const Wrapper = styled(FlexCenter)<{ isSimple?: boolean }>`
	height: 48px;
	max-width: 130px;
	width: 100%;
	gap: 10px;
	display: flex;
	align-items: center;
	padding: 0 15px;
	background: white;
	border-radius: 48px;
	box-shadow: ${Shadow.Neutral[500]};
	cursor: pointer;
`;

const BadgeText = styled(ButtonText)`
	color: ${neutralColors.gray[500]};
	margin: 0 auto;
`;

export default ShareLikeBadge;
